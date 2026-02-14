"use client";

import type { AuditOutput } from "../../../shared/schemas";
import { CheckCircle2, XCircle, AlertCircle, User, BookOpen, AlertTriangle } from "lucide-react";

function getBadgeStyles(decision: string) {
    switch (decision) {
        case "APPROVE": return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "DENY": return "bg-red-50 text-red-700 border-red-100";
        case "PEND_INFO": return "bg-amber-50 text-amber-700 border-amber-100";
        case "NEEDS_HUMAN": return "bg-slate-50 text-slate-700 border-slate-100";
        default: return "bg-slate-50 text-slate-600";
    }
}

function getDecisionIcon(decision: string) {
    switch (decision) {
        case "APPROVE": return <CheckCircle2 size={16} />;
        case "DENY": return <XCircle size={16} />;
        case "PEND_INFO": return <AlertCircle size={16} />;
        case "NEEDS_HUMAN": return <User size={16} />;
        default: return <AlertCircle size={16} />;
    }
}

function ConfidenceBar({ value }: { value: number }) {
    const pct = Math.round(value * 100);
    const colorClass = value >= 0.8 ? "bg-emerald-500" : value >= 0.5 ? "bg-amber-500" : "bg-red-500";

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="font-mono text-sm font-semibold text-slate-700 min-w-[3rem]">
                {pct}%
            </span>
        </div>
    );
}

export default function AuditResult({ result }: { result: AuditOutput }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Audit Result</h2>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                        ID: {result.audit_id.slice(0, 8)}...
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${getBadgeStyles(result.decision)}`}>
                    {getDecisionIcon(result.decision)}
                    {result.decision}
                </div>
            </div>

            {/* Confidence */}
            <div className="mb-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Confidence Score
                </div>
                <ConfidenceBar value={result.confidence} />
            </div>

            {/* Explanation */}
            <div className="mb-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Explanation
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm leading-relaxed text-slate-700">
                    {result.explanation}
                </div>
            </div>

            {/* Rules Applied */}
            {result.rules_applied.length > 0 && (
                <div className="mb-6">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Rules Applied ({result.rules_applied.length})
                    </div>
                    <div className="space-y-2">
                        {result.rules_applied.map((rule, i) => (
                            <div
                                key={rule.rule_id}
                                className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${rule.satisfied
                                        ? "bg-emerald-50/50 border-emerald-100 text-slate-700"
                                        : "bg-red-50/50 border-red-100 text-slate-700"
                                    }`}
                            >
                                <div className={`mt-0.5 ${rule.satisfied ? "text-emerald-500" : "text-red-500"}`}>
                                    {rule.satisfied ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-900">
                                        {rule.rule_text}
                                    </div>
                                    {rule.explanation && (
                                        <div className="mt-1 text-xs text-slate-500">
                                            {rule.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Citations */}
            {result.citations.length > 0 && (
                <div className="mb-6">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Supporting Evidence ({result.citations.length})
                    </div>
                    <div className="space-y-3">
                        {result.citations.map((cite, i) => (
                            <div
                                key={`${cite.chunk_id}-${i}`}
                                className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-sky-500"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-sky-600">
                                        <BookOpen size={14} />
                                        {cite.policy_name || cite.policy_id}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400">
                                        Pg {cite.page} · {cite.section_path}
                                    </div>
                                </div>
                                <div className="text-sm italic text-slate-600 leading-relaxed pl-2 border-l-2 border-slate-100">
                                    &ldquo;{cite.text_excerpt}&rdquo;
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Missing Info */}
            {result.missing_info.length > 0 && (
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Missing Information
                    </div>
                    <ul className="space-y-2">
                        {result.missing_info.map((info, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-100"
                            >
                                <AlertTriangle size={14} className="text-amber-500" />
                                {info}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
