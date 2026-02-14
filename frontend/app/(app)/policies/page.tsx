"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, Calendar, Building2, Package, CheckCircle, AlertCircle } from "lucide-react";

import { API_BASE } from "../../lib/api";

interface Policy {
    policy_id: string;
    name: string;
    payer: string;
    effective_date: string;
    status: string;
    created_at: string;
}

export default function PoliciesPage() {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: "",
        payer: "",
        effective_date: "",
    });

    // Fetch policies on mount
    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/policies/`);
            const data = await response.json();
            setPolicies(data.policies || []);
        } catch (error) {
            console.error("Failed to fetch policies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            setUploadError(null);
        } else {
            setUploadError("Please select a valid PDF file");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            setUploadError(null);
        } else {
            setUploadError("Please drop a valid PDF file");
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadError("Please select a PDF file");
            return;
        }

        setUploading(true);
        setUploadError(null);
        setUploadResult(null);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("name", form.name);
            formData.append("payer", form.payer);
            formData.append("effective_date", form.effective_date);

            const response = await fetch(`${API_BASE}/policies/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Upload failed");
            }

            const result = await response.json();
            setUploadResult({
                message: result.message,
                policy_id: result.policy.policy_id,
                chunks_created: result.chunks_created,
            });

            // Reset form
            setForm({ name: "", payer: "", effective_date: "" });
            setSelectedFile(null);
            if (fileRef.current) fileRef.current.value = "";

            // Refresh policies list
            await fetchPolicies();
        } catch (error: any) {
            setUploadError(error.message || "Failed to upload policy");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Policy Management</h1>
                <p className="text-slate-500 font-medium">
                    Upload and manage coverage policy documents
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Form */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Upload New Policy</h2>

                    <form onSubmit={handleUpload} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Policy Name *</label>
                            <input
                                className="input-field"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Medicare LCD — Outpatient Services"
                                required
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
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Effective Date *</label>
                                <input
                                    className="input-field"
                                    type="date"
                                    value={form.effective_date}
                                    onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Drag Drop Zone */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Policy PDF *</label>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${dragging
                                    ? "border-sky-500 bg-sky-50"
                                    : selectedFile
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedFile ? "bg-emerald-100" : "bg-slate-100"
                                        }`}>
                                        <FileText className={selectedFile ? "text-emerald-600" : "text-slate-400"} size={24} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-700 mb-1">
                                            {selectedFile ? selectedFile.name : "Drop PDF here or click to browse"}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Supports PDF files up to 50MB"}
                                        </div>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileRef}
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </div>

                        {uploadResult && (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-700">
                                <div className="flex items-center gap-2 font-semibold mb-1">
                                    <CheckCircle size={16} />
                                    Upload Successful!
                                </div>
                                <div className="text-xs text-emerald-600 ml-6">
                                    {uploadResult.chunks_created} chunks created for RAG pipeline
                                </div>
                            </div>
                        )}

                        {uploadError && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 flex items-center gap-2">
                                <AlertCircle size={16} />
                                {uploadError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={uploading || !selectedFile}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-white transition-all shadow-md ${uploading || !selectedFile
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-sky-500 hover:bg-sky-600 hover:shadow-lg hover:-translate-y-0.5"
                                }`}
                        >
                            {uploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Uploading & Processing...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Upload Policy
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Existing Policies */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Policy Library</h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : policies.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-slate-400" size={32} />
                            </div>
                            <div className="text-sm font-semibold text-slate-700 mb-1">No policies uploaded yet</div>
                            <div className="text-xs text-slate-500">Upload your first policy document to get started</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {policies.map((policy) => (
                                <div
                                    key={policy.policy_id}
                                    className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-white transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="font-semibold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                                            {policy.name}
                                        </div>
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${policy.status === "active"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}
                                        >
                                            {policy.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 size={12} />
                                            {policy.payer}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {policy.effective_date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Package size={12} />
                                            ID: {policy.policy_id.substring(0, 8)}...
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
