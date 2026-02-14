"use client";

import { useEffect, useState } from "react";
import { Database, Zap, Cloud, Server, HardDrive, Settings as SettingsIcon, Save } from "lucide-react";
import { API_BASE } from "../../lib/api";

export default function SettingsPage() {
    const [health, setHealth] = useState<any>(null);

    useEffect(() => {
        fetch(`${API_BASE}/health`)
            .then((r) => r.json())
            .then(setHealth)
            .catch(() => setHealth({ status: "unreachable", integrations: {} }));
    }, []);

    const integrations = [
        { key: "supabase", label: "Supabase (Auth + DB)", desc: "PostgreSQL database and authentication", envKey: "SUPABASE_URL", icon: Database },
        { key: "groq", label: "Groq LLM", desc: "Fast inference for rule extraction", envKey: "GROQ_API_KEY", icon: Zap },
        { key: "qdrant", label: "Qdrant Cloud", desc: "Vector database for policy chunks", envKey: "QDRANT_URL", icon: Cloud },
        { key: "redis", label: "Upstash Redis", desc: "Caching and rate limiting", envKey: "UPSTASH_REDIS_URL", icon: Server },
        { key: "r2", label: "Cloudflare R2", desc: "Policy PDF storage", envKey: "R2_ENDPOINT", icon: HardDrive },
    ];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium">
                    System configuration and integration status
                </p>
            </div>

            {/* Integration Status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                        <SettingsIcon className="text-sky-600" size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Integration Status</h2>
                </div>

                <div className="space-y-4">
                    {integrations.map((intg) => {
                        const connected = health?.integrations?.[intg.key];
                        const Icon = intg.icon;

                        return (
                            <div
                                key={intg.key}
                                className="flex justify-between items-center p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                        <Icon className="text-slate-600" size={18} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm mb-0.5">{intg.label}</div>
                                        <div className="text-xs text-slate-500">{intg.desc}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <code className="text-xs text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 font-mono">
                                        {intg.envKey}
                                    </code>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${connected
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-amber-100 text-amber-700 border border-amber-200"
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"
                                            }`} />
                                        {connected ? "Connected" : "Mock Mode"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* App Config */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Application Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Tokens per Audit</label>
                        <input
                            className="input-field"
                            defaultValue="4096"
                            type="number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Retrieval Chunks</label>
                        <input
                            className="input-field"
                            defaultValue="10"
                            type="number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Audit Timeout (seconds)</label>
                        <input
                            className="input-field"
                            defaultValue="30"
                            type="number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prompt Version</label>
                        <input
                            className="input-field opacity-60"
                            defaultValue="v1.0"
                            readOnly
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-all hover:-translate-y-0.5">
                        <Save size={18} />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
