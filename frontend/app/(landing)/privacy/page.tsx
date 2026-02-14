import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                            CA
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">ClaimAudit</span>
                    </Link>
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-500 mb-12">Last updated: February 14, 2026</p>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            ClaimAudit is a technical demonstration project designed to showcase advanced RAG (Retrieval-Augmented Generation)
                            architecture and AI-powered healthcare claims processing. This privacy policy outlines how we handle data in this demo environment.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Demo Environment Notice</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            This is a demonstration application intended for technical evaluation and portfolio purposes.
                            It is not a production system and should not be used to process real Protected Health Information (PHI)
                            or actual insurance claims data.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Collection</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            In this demo environment, we may collect:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
                            <li>Sample claim data you submit through the demo interface</li>
                            <li>Technical logs for debugging and performance monitoring</li>
                            <li>Usage analytics to understand how the demo is being explored</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">
                            All data submitted is treated as synthetic/test data and is not used for any commercial purposes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            While this is a demo application, we implement industry-standard security practices including:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>HTTPS encryption for all data transmission</li>
                            <li>Secure API endpoints with rate limiting</li>
                            <li>Regular security updates and dependency management</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            This demo may utilize the following third-party services:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>OpenAI API for embeddings and language model inference</li>
                            <li>Groq API for fast LLM inference</li>
                            <li>Qdrant for vector search capabilities</li>
                            <li>Supabase for authentication and data storage</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
                        <p className="text-slate-600 leading-relaxed">
                            For questions about this privacy policy or the demo application, please contact us at{" "}
                            <a href="mailto:demo@claimaudit.com" className="text-sky-600 hover:text-sky-700 font-semibold">
                                demo@claimaudit.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-200 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-slate-500 text-sm">
                        © 2026 ClaimAudit. Technical demonstration project.
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-slate-500 hover:text-sky-600 text-sm font-medium">Privacy</Link>
                        <Link href="/terms" className="text-slate-500 hover:text-sky-600 text-sm font-medium">Terms</Link>
                        <Link href="/contact" className="text-slate-500 hover:text-sky-600 text-sm font-medium">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
