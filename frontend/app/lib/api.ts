/**
 * API service layer — all backend calls go through here.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface FetchOptions extends RequestInit {
    timeout?: number;
}

class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { timeout = 30000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${API_BASE}${path}`, {
            ...fetchOptions,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...fetchOptions.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: "Unknown error" }));
            throw new ApiError(error.detail || response.statusText, response.status);
        }

        return response.json();
    } finally {
        clearTimeout(timeoutId);
    }
}

// ── Audit ──────────────────────────────────────────────────

import type { ClaimInput, AuditOutput } from "../../../shared/schemas";

export async function runAudit(claim: ClaimInput): Promise<AuditOutput> {
    return request<AuditOutput>("/audit/", {
        method: "POST",
        body: JSON.stringify(claim),
    });
}

// ── Claims ─────────────────────────────────────────────────

export async function listClaims(): Promise<{ claims: ClaimInput[]; total: number }> {
    return request("/claims/");
}

export async function createClaim(claim: ClaimInput): Promise<ClaimInput> {
    return request<ClaimInput>("/claims/", {
        method: "POST",
        body: JSON.stringify(claim),
    });
}

export async function getClaim(claimId: string): Promise<ClaimInput> {
    return request<ClaimInput>(`/claims/${claimId}`);
}

export async function deleteClaim(claimId: string): Promise<void> {
    return request(`/claims/${claimId}`, { method: "DELETE" });
}

// ── Policies ───────────────────────────────────────────────

export async function listPolicies(): Promise<{ policies: any[]; total: number }> {
    return request("/policies/");
}

export async function uploadPolicy(formData: FormData): Promise<any> {
    const response = await fetch(`${API_BASE}/policies/upload`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Upload failed" }));
        throw new ApiError(error.detail, response.status);
    }
    return response.json();
}

// ── Health ─────────────────────────────────────────────────

export async function getHealth(): Promise<any> {
    return request("/health");
}
