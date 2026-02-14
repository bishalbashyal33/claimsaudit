"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, TrendingUp, MessageSquare, Clock } from "lucide-react";

export default function FeedbackPage() {
    // Feedback feature coming soon - will integrate with backend
    const sampleFeedback: any[] = [];
    const correct = 0;
    const total = 0;
    const accuracy = "0";

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Auditor Feedback</h1>
                <p className="text-slate-500 font-medium">
                    Review feedback on audit decisions to improve accuracy
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                            <TrendingUp className="text-sky-600" size={20} />
                        </div>
                        <div className="text-sm font-semibold text-slate-500">System Accuracy</div>
                    </div>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                        {accuracy}%
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <MessageSquare className="text-slate-600" size={20} />
                        </div>
                        <div className="text-sm font-semibold text-slate-500">Total Reviews</div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900">{total}</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="text-emerald-600" size={20} />
                        </div>
                        <div className="text-sm font-semibold text-slate-500">Correct Decisions</div>
                    </div>
                    <div className="text-4xl font-bold text-emerald-600">{correct}</div>
                </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[100px_120px_100px_140px_1fr_140px] gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div>ID</div>
                    <div>Audit ID</div>
                    <div>Status</div>
                    <div>Reason</div>
                    <div>Comment</div>
                    <div>Date</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {sampleFeedback.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <Clock className="text-slate-400" size={32} />
                            </div>
                            <div className="text-sm font-semibold text-slate-700 mb-1">Feedback System Coming Soon</div>
                            <div className="text-xs text-slate-500 max-w-md mx-auto">
                                The auditor feedback system will allow you to review and improve audit decisions. This feature is currently under development.
                            </div>
                        </div>
                    ) : (
                        sampleFeedback.map((fb) => (
                            <div
                                key={fb.id}
                                className="grid grid-cols-[100px_120px_100px_140px_1fr_140px] gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors"
                            >
                                <div className="font-mono text-xs text-slate-600">{fb.id}</div>
                                <div className="font-mono text-xs text-sky-600 font-semibold">{fb.audit_id}</div>
                                <div>
                                    {fb.is_correct ? (
                                        <div className="flex items-center gap-1.5 text-emerald-600">
                                            <CheckCircle2 size={16} />
                                            <span className="text-xs font-semibold">Correct</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-red-600">
                                            <XCircle size={16} />
                                            <span className="text-xs font-semibold">Incorrect</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-slate-600">{fb.reason || "—"}</div>
                                <div className="text-sm text-slate-600">{fb.comment || "—"}</div>
                                <div className="text-xs text-slate-500">{fb.created_at}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
