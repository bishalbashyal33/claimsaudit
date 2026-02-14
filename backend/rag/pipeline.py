"""
RAG Pipeline Implementation using LangGraph.
Implements a state-of-the-art Multi-Step Auditing flow with:
1. Context Retrieval with Policy Identification
2. Recursive Auditing (Auditor -> Verifier -> Refiner loop)
3. Anti-Hallucination via metadata-gated consistency checks
4. Robust confidence scoring based on evidence strength
"""
import json
import operator
from typing import Annotated, List, Dict, Any, Union, Optional
from datetime import datetime
from uuid import uuid4

from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, END

from shared.schemas import ClaimInput, AuditOutput, Citation, RuleApplied, AuditDecision
from backend.config import settings
from backend.rag.singletons import get_vector_store

# --- Pydantic Models for LLM Interaction ---

class LLMRuleExtra(BaseModel):
    rule_text: str = Field(description="The specific policy rule extracted")
    satisfied: bool = Field(description="Whether the claim satisfies this rule")
    explanation: str = Field(description="Why the rule is satisfied or not")
    citation_text: str = Field(description="EXACT quote from the policy text")
    source_policy_title: str = Field(description="The EXACT title of the policy this rule comes from")

class LLMAuditDraft(BaseModel):
    decision: str = Field(description="APPROVE, DENY, or PEND_INFO")
    confidence: float = Field(description="Initial confidence score (0.0-1.0)")
    explanation: str = Field(description="Overall audit summary")
    rules: List[LLMRuleExtra] = Field(description="Detailed rule applications with citations")
    missing_info: List[str] = Field(description="Any missing data required for a definitive decision", default=[])

class LLMVerification(BaseModel):
    is_hallucination: bool = Field(description="True if any part of the audit is NOT supported by the provided context")
    errors: List[str] = Field(description="Specific list of hallucinated claims or invalid citations")
    improvement_notes: str = Field(description="Instructions on how to fix the audit")

class LLMConfidenceScorer(BaseModel):
    final_score: float = Field(description="Calculated confidence score (0.0-1.0)")
    reasoning: str = Field(description="Rubric-based reasoning for the score")

# --- LangGraph State Definition ---

class AuditState(TypedDict):
    # Inputs
    claim: ClaimInput
    
    # Context
    retrieved_chunks: List[Dict[str, Any]]
    context_str: str
    
    # Process
    audit_draft: Optional[LLMAuditDraft]
    verification: Optional[LLMVerification]
    confidence_reasoning: Optional[str]
    iteration_count: int
    
    # Output
    final_audit: Optional[AuditOutput]


# --- Prompts ---

AUDITOR_PROMPT = """
You are the Lead Auditor for APCA ClaimAudit. Your task is to audit a medical claim against the provided policy context.

CLAIM DETAILS:
- ID: {claim_id}
- Payer: {payer}
- Codes: {cpt_codes} / {icd_codes}
- Billed: ${billed_amount}

POLICY CONTEXT:
{context}

INSTRUCTIONS:
1. Review the claim against the policies. 
2. Identify specific rules. For each rule, you MUST provide an EXACT citation from the context.
3. Use the 'source_policy_title' as provided in the context chunks (e.g., "UHC Bone Density Policy"). 
4. If a rule is not explicitly covered, mark the decision as PEND_INFO or NEEDS_HUMAN.
5. Do NOT use external medical knowledge.

OUTPUT FORMAT:
{format_instructions}
"""

VERIFIER_PROMPT = """
You are the Audit Integrity Officer. Your job is to catch hallucinations.
Compare the Audit Draft against the Original Context.

AUDIT DRAFT:
{audit_draft}

ORIGINAL CONTEXT:
{context}

VERIFICATION CRITERIA:
1. Every 'citation_text' must exist LITERALLY in the context.
2. The 'source_policy_title' must match a title provided in the context metadata.
3. No external rules or medical criteria should be introduced that aren't in the context.
4. The decision must be logically sound based ONLY on the cited text.

OUTPUT FORMAT:
{format_instructions}
"""

REFINER_PROMPT = """
The Audit Integrity Officer found errors in your previous draft. Please fix them.

PREVIOUS DRAFT:
{audit_draft}

ERRORS FOUND:
{errors}

IMPROVEMENT NOTES:
{notes}

ORIGINAL CONTEXT:
{context}

Provide a corrected audit draft.
{format_instructions}
"""

SCORER_PROMPT = """
You are the Final Audit Quality Scorer. Your task is to calculate a robust confidence score for the audit.

AUDIT DRAFT:
{audit_draft}

VERIFICATION OUTPUT:
{verification}

RUBRIC:
- 1.0: Every rule is supported by a direct, literal citation. High logical consistency. No missing info.
- 0.8-0.9: Solid citations, but minor ambiguity in policy mapping.
- 0.5-0.7: Missing some citations for auxiliary rules, or decision is PEND_INFO.
- <0.5: Significant missing info, weak citations, or verification loop detected initial hallucinations.

Calculate the final score and provide reasoning.
{format_instructions}
"""

# --- LLM Factory with Fallback ---

def get_llm(temperature: float = 0.0):
    """
    Returns an LLM with fallback logic.
    Primary: Groq (Llama 3.3 70B)
    Secondary: Google Gemini 1.5 Pro
    """
    groq_llm = ChatGroq(
        temperature=temperature, 
        model_name="llama-3.3-70b-versatile", 
        api_key=settings.GROQ_API_KEY
    )
    
    # Check if Google API Key is available for fallback
    if settings.GOOGLE_API_KEY:
        gemini_llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            temperature=temperature,
            google_api_key=settings.GOOGLE_API_KEY
        )
        return groq_llm.with_fallbacks([gemini_llm])
    
    return groq_llm

# --- Node Implementations ---

async def retrieve_node(state: AuditState) -> Dict[str, Any]:
    """Retrieve relevant chunks and format context string."""
    vector_store = get_vector_store()
    claim = state["claim"]
    
    # 1. Build Query
    query = f"coverage for {', '.join(claim.cpt_codes)} and {', '.join(claim.icd_codes)} under {claim.payer} policy"
    
    # 2. Build Filter
    # Prioritize specific policy selection if provided by user, else fallback to payer
    filter_meta = {}
    if claim.policy_id:
        filter_meta["policy_id"] = claim.policy_id
    elif claim.payer:
        filter_meta["payer"] = claim.payer

    chunks = vector_store.search(query=query, limit=6, filter_metadata=filter_meta)
    
    if not chunks:
        # If no strict matches, try a broader search without payer/policy lock as a fallback
        # (This is useful if there's a typo in payer name but policy exists)
        chunks = vector_store.search(query=query, limit=6)
        
    if not chunks:
        return {"retrieved_chunks": [], "context_str": "NO POLICY DATA FOUND."}
    
    # Format context with clear source identifiers
    formatted_chunks = []
    for i, c in enumerate(chunks):
        title = c["metadata"].get("policy_name", "General Policy")
        section = c["metadata"].get("section_path", "Main")
        formatted_chunks.append(f"--- POLICY: {title} | SECTION: {section} ---\n{c['text']}")
    
    return {
        "retrieved_chunks": chunks,
        "context_str": "\n\n".join(formatted_chunks)
    }


async def audit_node(state: AuditState) -> Dict[str, Any]:
    """Generate the initial audit draft."""
    if not state["context_str"] or state["context_str"] == "NO POLICY DATA FOUND.":
        raise ValueError("Cannot audit without policy context.")
        
    llm = get_llm(temperature=0.1)
    parser = JsonOutputParser(pydantic_object=LLMAuditDraft)
    
    prompt = ChatPromptTemplate.from_template(AUDITOR_PROMPT)
    chain = prompt | llm | parser
    
    claim = state["claim"]
    response = await chain.ainvoke({
        "claim_id": claim.claim_id,
        "payer": claim.payer,
        "cpt_codes": ", ".join(claim.cpt_codes),
        "icd_codes": ", ".join(claim.icd_codes),
        "billed_amount": str(claim.billed_amount),
        "context": state["context_str"],
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"audit_draft": response, "iteration_count": 1}

async def verify_node(state: AuditState) -> Dict[str, Any]:
    """Verify the audit draft for hallucinations."""
    llm = get_llm(temperature=0)
    parser = JsonOutputParser(pydantic_object=LLMVerification)
    
    prompt = ChatPromptTemplate.from_template(VERIFIER_PROMPT)
    chain = prompt | llm | parser
    
    response = await chain.ainvoke({
        "audit_draft": json.dumps(state["audit_draft"]),
        "context": state["context_str"],
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"verification": response}

async def refine_node(state: AuditState) -> Dict[str, Any]:
    """Refine the audit based on verification feedback."""
    llm = get_llm(temperature=0.1)
    parser = JsonOutputParser(pydantic_object=LLMAuditDraft)
    
    prompt = ChatPromptTemplate.from_template(REFINER_PROMPT)
    chain = prompt | llm | parser
    
    verification = state["verification"]
    response = await chain.ainvoke({
        "audit_draft": json.dumps(state["audit_draft"]),
        "errors": "\n".join(verification.get("errors", [])),
        "notes": verification.get("improvement_notes", ""),
        "context": state["context_str"],
        "format_instructions": parser.get_format_instructions()
    })
    
    return {
        "audit_draft": response, 
        "iteration_count": state["iteration_count"] + 1
    }

async def score_node(state: AuditState) -> Dict[str, Any]:
    """Calculate a robust confidence score based on the rubric."""
    llm = get_llm(temperature=0)
    parser = JsonOutputParser(pydantic_object=LLMConfidenceScorer)
    
    prompt = ChatPromptTemplate.from_template(SCORER_PROMPT)
    chain = prompt | llm | parser
    
    response = await chain.ainvoke({
        "audit_draft": json.dumps(state["audit_draft"]),
        "verification": json.dumps(state["verification"]),
        "format_instructions": parser.get_format_instructions()
    })
    
    # Update the draft's confidence
    draft = state["audit_draft"]
    draft["confidence"] = response.get("final_score", 0.0)
    
    return {"audit_draft": draft, "confidence_reasoning": response.get("reasoning", "")}

async def finalize_node(state: AuditState) -> Dict[str, Any]:
    """Map draft to final AuditOutput schema."""
    draft = state["audit_draft"]
    chunks = state["retrieved_chunks"]
    
    citations = []
    rules_applied = []
    
    for rule in draft.get("rules", []):
        # Match source policy title to get real IDs
        source_title = rule.get("source_policy_title", "")
        matched_chunk = None
        for c in chunks:
            if c["metadata"].get("policy_name") == source_title:
                matched_chunk = c
                break
        
        if not matched_chunk and chunks:
            matched_chunk = chunks[0] # Fallback
            
        cit = Citation(
            policy_id=matched_chunk["metadata"].get("policy_id", "unknown") if matched_chunk else "unknown",
            policy_name=source_title or "Unspecified Policy",
            page=matched_chunk["metadata"].get("page", 1) if matched_chunk else 1,
            section_path=matched_chunk["metadata"].get("section_path", "General") if matched_chunk else "General",
            chunk_id=str(uuid4()),
            text_excerpt=rule.get("citation_text", ""),
            start_char=0,
            end_char=0
        )
        citations.append(cit)
        
        rapp = RuleApplied(
            rule_id=str(uuid4()),
            rule_text=rule.get("rule_text", ""),
            satisfied=rule.get("satisfied", False),
            citation=cit,
            explanation=rule.get("explanation", "")
        )
        rules_applied.append(rapp)

    # Enforce schema invariants
    decision_map = {
        "APPROVE": AuditDecision.APPROVE,
        "DENY": AuditDecision.DENY,
        "PEND_INFO": AuditDecision.PEND_INFO,
        "NEEDS_HUMAN": AuditDecision.NEEDS_HUMAN
    }
    decision_str = draft.get("decision", "PEND_INFO").upper()
    decision = decision_map.get(decision_str, AuditDecision.PEND_INFO)
        
    # Check invariant: decision needs citations
    if decision in [AuditDecision.APPROVE, AuditDecision.DENY] and not citations:
        decision = AuditDecision.PEND_INFO

    final = AuditOutput(
        audit_id=str(uuid4()),
        claim_id=state["claim"].claim_id,
        decision=decision,
        confidence=draft.get("confidence", 0.0),
        rules_applied=rules_applied,
        citations=citations,
        explanation=f"{draft.get('explanation', '')}\n\nConfidence Reasoning: {state.get('confidence_reasoning', 'N/A')}",
        missing_info=draft.get("missing_info", []),
        prompt_version="v2.1-sota-multi-agent",
        created_at=datetime.utcnow()
    )
    
    return {"final_audit": final}

# --- Router Logic ---

def should_refine(state: AuditState) -> str:
    """Determine if we need another iteration or can finish."""
    if state["iteration_count"] >= 2: # Max 2 attempts
        return "score"
    
    if state["verification"] and state["verification"].get("is_hallucination"):
        return "refine"
    
    return "score"

# --- Graph Construction ---

def create_audit_graph():
    workflow = StateGraph(AuditState)
    
    workflow.add_node("retrieve", retrieve_node)
    workflow.add_node("audit", audit_node)
    workflow.add_node("verify", verify_node)
    workflow.add_node("refine", refine_node)
    workflow.add_node("score", score_node)
    workflow.add_node("finalize", finalize_node)
    
    workflow.set_entry_point("retrieve")
    workflow.add_edge("retrieve", "audit")
    workflow.add_edge("audit", "verify")
    
    workflow.add_conditional_edges(
        "verify",
        should_refine,
        {
            "refine": "refine",
            "score": "score"
        }
    )
    
    workflow.add_edge("refine", "verify") # Re-verify after refinement
    workflow.add_edge("score", "finalize")
    workflow.add_edge("finalize", END)
    
    return workflow.compile()

# --- Public API ---

async def run_rag_pipeline(claim: ClaimInput) -> AuditOutput:
    """Entry point for the state-of-the-art audit pipeline."""
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured")

    app = create_audit_graph()
    
    initial_state = {
        "claim": claim,
        "retrieved_chunks": [],
        "context_str": "",
        "audit_draft": None,
        "verification": None,
        "confidence_reasoning": None,
        "iteration_count": 0,
        "final_audit": None
    }
    
    result = await app.ainvoke(initial_state)
    return result["final_audit"]
