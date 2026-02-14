"use client";

import { useState, useEffect } from "react";
import { runAudit } from "../../lib/api";
import type { ClaimInput, AuditOutput } from "../../../../shared/schemas";
import AuditResult from "../../components/AuditResult";
import { PlayCircle, Wand2, Calculator, Loader2, FileText } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

interface Policy {
    policy_id: string;
    name: string;
    payer: string;
    effective_date: string;
    uploaded_at: string;
}

export default function AuditPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AuditOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [selectedPolicy, setSelectedPolicy] = useState<string>("");

    const [form, setForm] = useState({
        patient_id: "",
        cpt_codes: "",
        icd_codes: "",
        service_date: "",
        payer: "",
        provider_npi: "",
        billed_amount: "",
        notes: "",
    });

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const response = await fetch(`${API_BASE}/policies/`);
            const data = await response.json();
            setPolicies(data.policies || []);
            // Auto-select first policy if available
            if (data.policies && data.policies.length > 0) {
                setSelectedPolicy(data.policies[0].policy_id);
            }
        } catch (error) {
            console.error("Failed to fetch policies:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const claim: ClaimInput = {
                patient_id: form.patient_id,
                cpt_codes: form.cpt_codes.split(",").map((c) => c.trim()).filter(Boolean),
                icd_codes: form.icd_codes ? form.icd_codes.split(",").map((c) => c.trim()).filter(Boolean) : [],
                service_date: form.service_date,
                payer: form.payer,
                provider_npi: form.provider_npi,
                billed_amount: parseFloat(form.billed_amount),
                notes: form.notes || undefined,
                policy_id: selectedPolicy || undefined,
            };

            const auditResult = await runAudit(claim);
            setResult(auditResult);
        } catch (err: any) {
            setError(err.message || "Failed to run audit");
        } finally {
            setLoading(false);
        }
    };

    const fillSample = () => {
        // Use the selected policy's payer if available
        const selectedPolicyData = policies.find(p => p.policy_id === selectedPolicy);
        const isMedicare = selectedPolicyData?.payer === "Medicare" || selectedPolicyData?.name.includes("NCD");
        const payer = selectedPolicyData?.payer || "Medicare";

        // Logic to randomize between approved and denied scenarios for CPAP
        const scenarios = [
            {
                ahi: 18,
                symptoms: "documented fatigue",
                codes: ["G47.33"],
                notes: "Patient diagnosed with OSA via PSG. AHI is 18. Beneficiary educated on device use.",
                expected: "APPROVE (HI AHI)"
            },
            {
                ahi: 8,
                symptoms: "documented hypertension and ischemic heart disease",
                codes: ["G47.33", "I10", "I25.10"],
                notes: "AHI is 8. History of hypertension and ischemic heart disease. Clinical evaluation positive for OSA.",
                expected: "APPROVE (MED AHI + SYM)"
            },
            {
                ahi: 3,
                symptoms: "no major symptoms",
                codes: ["G47.33"],
                notes: "Diagnosis of mild OSA. AHI is 3. Patient requests CPAP for snoring.",
                expected: "DENY (LOW AHI)"
            },
            {
                ahi: 7,
                symptoms: "impaired cognition noted",
                codes: ["G47.33", "F06.7"],
                notes: "CPAP requested for AHI of 7. Impaired cognition documented in clinical notes.",
                expected: "APPROVE (MED AHI + SYM)"
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        setForm({
            patient_id: `P-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            cpt_codes: isMedicare ? "E0601" : "99213",
            icd_codes: scenario.codes.join(", "),
            service_date: new Date().toISOString().split('T')[0],
            payer: payer,
            provider_npi: "1" + Math.floor(100000000 + Math.random() * 900000000).toString(),
            billed_amount: (500 + Math.random() * 1000).toFixed(2),
            notes: scenario.notes,
        });
    };


    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Run Audit</h1>
                <p className="text-slate-500 font-medium">
                    Submit a claim for automated policy-to-claim adjudication
                </p>
            </div>

            <div className={`grid gap-8 ${result ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-3xl"}`}>
                {/* Claim Form */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Claim Details</h2>
                        <button
                            onClick={fillSample}
                            type="button"
                            className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 transition-colors"
                        >
                            <Wand2 size={14} />
                            Fill Sample Data
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Policy Selector */}
                        <div className="pb-5 border-b border-slate-100">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Select Policy to Audit Against *
                            </label>
                            {policies.length === 0 ? (
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700 flex items-center gap-2">
                                    <FileText size={16} />
                                    <span>No policies uploaded yet. <a href="/policies" className="font-semibold underline">Upload a policy</a> first.</span>
                                </div>
                            ) : (
                                <select
                                    className="input-field"
                                    value={selectedPolicy}
                                    onChange={(e) => {
                                        setSelectedPolicy(e.target.value);
                                        const policy = policies.find(p => p.policy_id === e.target.value);
                                        if (policy) {
                                            setForm({ ...form, payer: policy.payer });
                                        }
                                    }}
                                    required
                                >
                                    {policies.map((policy) => (
                                        <option key={policy.policy_id} value={policy.policy_id}>
                                            {policy.name} ({policy.payer}) - {policy.effective_date}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient ID *</label>
                                <input
                                    className="input-field"
                                    value={form.patient_id}
                                    onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                                    placeholder="P-2024-0042"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Date *</label>
                                <input
                                    className="input-field"
                                    type="date"
                                    value={form.service_date}
                                    onChange={(e) => setForm({ ...form, service_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">CPT/HCPCS Codes * (comma-separated)</label>
                            <input
                                className="input-field"
                                value={form.cpt_codes}
                                onChange={(e) => setForm({ ...form, cpt_codes: e.target.value })}
                                placeholder="99213, 99214"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ICD-10 Codes (comma-separated)</label>
                            <input
                                className="input-field"
                                value={form.icd_codes}
                                onChange={(e) => setForm({ ...form, icd_codes: e.target.value })}
                                placeholder="J06.9, R05.9"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payer *</label>
                                <input
                                    className="input-field"
                                    value={form.payer}
                                    onChange={(e) => setForm({ ...form, payer: e.target.value })}
                                    placeholder="Medicare"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Provider NPI *</label>
                                <input
                                    className="input-field"
                                    value={form.provider_npi}
                                    onChange={(e) => setForm({ ...form, provider_npi: e.target.value })}
                                    placeholder="1234567890"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Billed Amount ($) *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                                <input
                                    className="input-field pl-8"
                                    type="number"
                                    step="0.01"
                                    value={form.billed_amount}
                                    onChange={(e) => setForm({ ...form, billed_amount: e.target.value })}
                                    placeholder="350.00"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes (optional)</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                placeholder="Additional context about the claim..."
                                rows={3}
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-white transition-all shadow-md ${loading
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-sky-500 hover:bg-sky-600 hover:shadow-lg hover:-translate-y-0.5"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Running Audit Pipeline...
                                </>
                            ) : (
                                <>
                                    <PlayCircle size={18} />
                                    Run Audit
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Audit Result */}
                {result && (
                    <div className="animate-fade-in">
                        <AuditResult result={result} />
                    </div>
                )}
            </div>
        </div>
    );
}
