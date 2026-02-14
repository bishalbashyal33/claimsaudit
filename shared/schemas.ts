/**
 * Shared TypeScript schemas for the APCA ClaimAudit system.
 * Mirrors the Python Pydantic schemas in schemas.py.
 */

// ── Enums ──────────────────────────────────────────────────

export type AuditDecision = "APPROVE" | "DENY" | "PEND_INFO" | "NEEDS_HUMAN";

export type FeedbackReason =
  | "wrong_policy"
  | "missing_evidence"
  | "wrong_rule_parse"
  | "claim_missing_fields"
  | "other";

// ── Claim Input ────────────────────────────────────────────

export interface ClaimInput {
  claim_id?: string;
  patient_id: string;
  cpt_codes: string[];
  icd_codes?: string[];
  service_date: string; // ISO date
  payer: string;
  provider_npi: string;
  billed_amount: number;
  notes?: string;
  policy_id?: string;

}

// ── Citation ───────────────────────────────────────────────

export interface Citation {
  policy_id: string;
  policy_name?: string;
  page: number;
  section_path: string;
  chunk_id: string;
  text_excerpt: string;
  start_char?: number;
  end_char?: number;
}

// ── Rule Applied ───────────────────────────────────────────

export interface RuleApplied {
  rule_id: string;
  rule_text: string;
  satisfied: boolean;
  citation?: Citation;
  explanation?: string;
}

// ── Audit Output ──────────────────────────────────────────

export interface AuditOutput {
  audit_id: string;
  claim_id: string;
  decision: AuditDecision;
  confidence: number;
  rules_applied: RuleApplied[];
  citations: Citation[];
  explanation: string;
  missing_info: string[];
  prompt_version: string;
  created_at: string; // ISO datetime
}

// ── Feedback ───────────────────────────────────────────────

export interface AuditorFeedback {
  feedback_id?: string;
  audit_id: string;
  is_correct: boolean;
  reason?: FeedbackReason;
  comment?: string;
  created_at?: string;
}

// ── Policy Metadata ───────────────────────────────────────

export interface PolicyMetadata {
  policy_id: string;
  name: string;
  payer: string;
  effective_date: string;
  expiration_date?: string;
  file_url?: string;
  status: "active" | "archived" | "draft";
  created_at: string;
}

// ── Chunk Record ──────────────────────────────────────────

export interface ChunkRecord {
  chunk_id: string;
  policy_id: string;
  payer: string;
  effective_date: string;
  page: number;
  section_path: string;
  text: string;
  start_char: number;
  end_char: number;
}
