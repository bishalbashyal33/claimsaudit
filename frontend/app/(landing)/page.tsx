import Link from "next/link";
import { Database, Zap, Shield, Code2, GitBranch, Layers } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                            CA
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">ClaimAudit</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="#architecture" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                            Architecture
                        </Link>
                        <Link href="#technology" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                            Technology
                        </Link>
                        <Link href="#contact" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                            Contact
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-100 rounded-full blur-3xl opacity-50 -z-10" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight animate-fade-in">
                        AI-Powered Healthcare Claims Auditing
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                            Technical Demo
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "100ms" }}>
                        A production-grade RAG pipeline with citation-gated AI, advanced hallucination reduction,
                        and scalable vector search for policy-to-claim adjudication.
                    </p>
                    <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
                        <Link
                            href="/dashboard"
                            className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            Explore Live Demo
                        </Link>
                        <Link
                            href="#architecture"
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold shadow-sm transition-all hover:border-slate-300"
                        >
                            View Architecture
                        </Link>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="mt-20 max-w-6xl mx-auto px-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden p-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col items-center">
                                    <div className="text-sm font-medium text-slate-500 mb-1">Approval Rate</div>
                                    <div className="text-3xl font-bold text-slate-900">94.2%</div>
                                    <div className="text-xs font-medium text-emerald-500 mt-2 bg-emerald-50 px-2 py-1 rounded-full">+2.4% vs baseline</div>
                                </div>

                                <div className="md:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                                                AI
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">Claim #8821</div>
                                                <div className="text-xs text-slate-500">Processed in 1.2s</div>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                            APPROVE
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                <span className="font-semibold text-slate-900">CPT 99213</span> matches <span className="font-semibold text-slate-900">Medicare Part B</span> coverage criteria.
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Diagnosis <span className="font-semibold text-slate-900">J06.9</span> supports medical necessity.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Stack Section */}
            <section id="technology" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Technology Stack</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Built with production-grade tools and frameworks optimized for accuracy, speed, and scalability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-50 hover:bg-sky-50/50 transition-colors border border-slate-100 group">
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 group-hover:border-sky-200 group-hover:shadow-sky-100 transition-all">
                                <Shield className="text-sky-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Hallucination Reduction</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Citation-gated architecture ensures every APPROVE/DENY decision is backed by specific policy excerpts with page numbers and section paths.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Mandatory source attribution via Pydantic validators</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Confidence scoring with uncertainty quantification</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Human-in-the-loop fallback for low-confidence cases</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 hover:bg-sky-50/50 transition-colors border border-slate-100 group">
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 group-hover:border-sky-200 group-hover:shadow-sky-100 transition-all">
                                <Database className="text-sky-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Scalable RAG Pipeline</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Advanced retrieval-augmented generation with hybrid search, semantic chunking, and distributed vector indexing.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Qdrant vector DB with HNSW indexing for sub-100ms retrieval</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Recursive character splitting with metadata preservation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Redis caching layer for frequently accessed policies</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 hover:bg-sky-50/50 transition-colors border border-slate-100 group">
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 group-hover:border-sky-200 group-hover:shadow-sky-100 transition-all">
                                <Layers className="text-sky-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Production Architecture</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Full-stack implementation with type-safe contracts, async processing, and comprehensive observability.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>FastAPI + LangGraph for orchestration and state management</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Next.js 14 with React Server Components</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 mt-0.5">•</span>
                                    <span>Supabase for auth, storage, and real-time subscriptions</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Overview */}
            <section id="architecture" className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">System Architecture</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            End-to-end data flow from policy ingestion to real-time audit decisions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                                    <Code2 className="text-sky-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Ingestion Pipeline</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">1</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">PDF Processing</div>
                                        <div className="text-sm text-slate-600">PyMuPDF extracts text with layout preservation and metadata tagging</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">2</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">Semantic Chunking</div>
                                        <div className="text-sm text-slate-600">RecursiveCharacterTextSplitter with 500-token chunks and 50-token overlap</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">3</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">Vector Embedding</div>
                                        <div className="text-sm text-slate-600">OpenAI text-embedding-3-small (1536 dimensions) for semantic search</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">4</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">Index Storage</div>
                                        <div className="text-sm text-slate-600">Qdrant collection with HNSW graph for approximate nearest neighbor search</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <GitBranch className="text-emerald-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Audit Workflow</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">1</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">Claim Normalization</div>
                                        <div className="text-sm text-slate-600">Pydantic validation ensures CPT/ICD codes, dates, and amounts are well-formed</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">2</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">Retrieval Phase</div>
                                        <div className="text-sm text-slate-600">Hybrid search (semantic + keyword) fetches top-k relevant policy chunks</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">3</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">LLM Reasoning</div>
                                        <div className="text-sm text-slate-600">Groq Llama 3.1 70B with structured output enforces citation requirements</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">4</div>
                                    <div>
                                        <div className="font-semibold text-slate-900 mb-1">Response Validation</div>
                                        <div className="text-sm text-slate-600">Post-processing checks ensure all decisions have supporting evidence</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Zap className="text-purple-600" size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Performance Metrics</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900 mb-1">1.2s</div>
                                <div className="text-sm text-slate-500">Avg. Audit Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900 mb-1">94%</div>
                                <div className="text-sm text-slate-500">Accuracy Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900 mb-1">50ms</div>
                                <div className="text-sm text-slate-500">Vector Retrieval</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900 mb-1">99.8%</div>
                                <div className="text-sm text-slate-500">Citation Coverage</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Interested in discussing the technical implementation or exploring collaboration opportunities?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:demo@claimaudit.com"
                            className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            Contact via Email
                        </a>
                        <Link
                            href="/dashboard"
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold shadow-sm transition-all hover:border-slate-300"
                        >
                            Explore Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-slate-500 text-sm">
                        © 2026 ClaimAudit. Technical demonstration project.
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-slate-500 hover:text-sky-600 text-sm font-medium">Privacy</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-sky-600 text-sm font-medium">Terms</Link>
                        <Link href="#contact" className="text-slate-500 hover:text-sky-600 text-sm font-medium">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
