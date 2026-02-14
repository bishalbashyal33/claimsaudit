"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Filter, FileText } from "lucide-react";

const API_BASE = "http://localhost:8000/api";

interface Claim {
    claim_id: string;
    patient_id: string;
    payer: string;
    billed_amount: number;
    service_date: string;
    cpt_codes: string[];
    decision?: string;
    confidence?: number;
    created_at: string;
}

function getStatusBadgeStyles(decision?: string) {
    if (!decision) return "bg-slate-50 text-slate-700 border-slate-100";
    switch (decision) {
        case "APPROVE": return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "DENY": return "bg-red-50 text-red-700 border-red-100";
        case "PEND_INFO": return "bg-amber-50 text-amber-700 border-amber-100";
        case "NEEDS_HUMAN": return "bg-slate-50 text-slate-700 border-slate-100";
        default: return "bg-sky-50 text-sky-700 border-sky-100";
    }
}

export default function ClaimsPage() {
    const [search, setSearch] = useState("");
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/claims/`);
            const data = await response.json();
            setClaims(data.claims || []);
        } catch (error) {
            console.error("Failed to fetch claims:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = claims.filter(
        (c) => c.claim_id.toLowerCase().includes(search.toLowerCase()) ||
            c.patient_id.toLowerCase().includes(search.toLowerCase()) ||
            c.payer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Claims</h1>
                    <p className="text-slate-500 font-medium">
                        Manage and track submitted insurance claims
                    </p>
                </div>
                <Link
                    href="/audit"
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm shadow-sky-200 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={18} />
                    New Claim Audit
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 transition-all shadow-sm"
                        placeholder="Search by claim ID, patient, or payer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter size={16} />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div>Claim ID</div>
                    <div>Patient</div>
                    <div>Payer</div>
                    <div>Amount</div>
                    <div>Date</div>
                    <div>Status</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {filtered.map((claim) => (
                        <div
                            key={claim.claim_id}
                            className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                            <div>
                                <div className="font-semibold text-slate-900">{claim.claim_id}</div>
                                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                                    <FileText size={12} />
                                    CPT: {claim.cpt_codes.join(", ")}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-slate-600">{claim.patient_id}</div>
                            <div className="text-sm text-slate-600">{claim.payer}</div>
                            <div className="text-sm font-mono font-medium text-slate-900">${claim.billed_amount.toLocaleString()}</div>
                            <div className="text-sm text-slate-500">{claim.service_date}</div>
                            <div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyles(claim.decision)}`}>
                                    {claim.decision || "PENDING"}
                                </span>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Search size={24} />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">No claims found</h3>
                            <p className="text-slate-500 text-sm">
                                No claims match your search query "{search}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-500 px-2">
                <div>Showing {filtered.length} of {claims.length} claims</div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:border-slate-300 transition-colors disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-white hover:border-slate-300 transition-colors disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
}
