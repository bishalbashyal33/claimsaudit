# ClaimAudit: AI-Powered Medical Claim Adjudication

![ClaimAudit Dashboard](resources/dashboard_screenshot.png)

## System Architecture

![Claim Audit Architecture](resources/architecture_diagram_v2.png)

![System Overview](resources/image.png)

This diagram illustrates the end-to-end flow of the ClaimAudit system, from data ingestion to final adjudication:

1.  **Policy Ingestion (The Foundation)**:
    -   Admin uploads a policy PDF (e.g., "Medicare NCD 240.4").
    -   **Ingestion Pipeline** extracts text, cleans it, and splits it into semantic chunks.
    -   **Local Embeddings**: A Sentence-Transformer model (running directly in the container) converts these chunks into vector embeddings.
    -   **Vector Store**: embeddings are stored in **Qdrant** for semantic retrieval.

2.  **Audit Operations (The Core)**:
    -   **API Gateway**: A FastAPI service on **Google Cloud Run** receives the claim.
    -   **LangGraph Orchestrator**: The claim enters a multi-step loop:
        -   *Retrieve*: Fetches relevant policy chunks from Qdrant.
        -   *Audit*: LLM drafts an initial decision.
        -   *Verify*: A second LLM agent checks the draft against the raw text for hallucinations.
        -   *Refine*: If errors are found, the draft is corrected.
    -   **Dual-Engine AI**: The system dynamically uses **Google Gemini 1.5 Pro** or **Groq Llama 3** based on availability and load.

Traditional claim auditing is manual, error-prone, and slow. ClaimAudit automates this by enforcing policy rules with strict verification steps, significantly reducing administrative overhead and enhancing accuracy.

## Key Features

### 🚀 Scalability & Architecture
The entire system is containerized and deployed on **Google Cloud Run**, ensuring serverless scalability.
- **Backend**: FastAPI (Python) handles the orchestration and API logic.
- **Frontend**: Next.js (TypeScript) provides a responsive, modern dashboard.
- **Vector Search**: Qdrant (for policy ingestion and retrieval) ensures fast, semantic search across thousands of policy documents.
- **Dockerized**: A single `Dockerfile` builds the entire stack for consistent deployment across environments.

### 🛡️ Hallucination Reduction
One of the biggest challenges in AI is "hallucination" — where the model invents facts. ClaimAudit mitigates this through a multi-step verification pipeline:
1.  **Strict Context**: The LLM is forced to use *only* the retrieved policy chunks.
2.  **Verifier Agent**: A dedicated "Audit Integrity Officer" agent reviews the draft audit. If it finds any claim not supported by the text, it rejects the draft.
3.  **Citation Requirement**: Every rule application *must* quote the policy text directly.

### 🤖 Multi-Agent LangGraph
The core adjudication logic is built on **LangGraph**, creating a stateful, cyclic workflow:
- **Retrieve Node**: Fetches relevant policy sections based on CPT/ICD codes.
- **Audit Node**: An "Auditor" agent drafts the initial decision.
- **Verify Node**: A "Verifier" agent checks for hallucinations and logic errors.
- **Refine Node**: If errors are found, the "Refiner" agent corrects the draft.
- **Score Node**: Calculates a confidence score based on the strength of evidence.

This cyclic graph ensures that the final output is not just a one-shot guess, but a rigorously reviewed decision.

### 🔍 Citation Mechanism
Transparency is critical. ClaimAudit provides "clickable" citations:
- **Exact Quotes**: The system extracts the specific sentence from the PDF that justifies the decision.
- **Source Linking**: Each citation links back to the exact page and section of the policy document.
- **Visual Proof**: Users can see the highlighted text in the policy viewer alongside the audit result.

## Tech Stack
-   **AI/LLM**: Google Gemini 1.5 Pro (Primary) / Groq Llama 3 (Secondary)
-   **Orchestration**: LangGraph, LangChain
-   **Backend**: FastAPI, Uvicorn
-   **Frontend**: Next.js, Tailwind CSS, Lucide React
-   **Database**: Qdrant (Vector), Supabase (Relational - *Roadmap*)
-   **Infrastructure**: Google Cloud Run, Docker

## Getting Started

### Prerequisites
-   Docker
-   Google Cloud Project (for deployment)
-   API Keys (Google Gemini, Groq - optional)

### Running Locally
```bash
# 1. Clone the repository
git clone https://github.com/bishalbashyal33/claimsaudit.git
cd claimsaudit

# 2. Build and run with Docker
docker-compose up --build
# OR manually
npm run dev --prefix frontend
uvicorn backend.main:app --reload
```

### Deployment to Cloud Run 
```bash
gcloud run deploy claimsaudit --source .
```

---

