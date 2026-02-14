import Link from "next/link";

export default function TermsPage() {
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
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                <p className="text-slate-500 mb-12">Last updated: February 14, 2026</p>

                <div className="prose prose-slate max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            By accessing and using the ClaimAudit demo application, you acknowledge and agree to these Terms of Service.
                            This is a technical demonstration project and is provided "as is" for evaluation purposes only.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Demo Application Disclaimer</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            ClaimAudit is a portfolio/demonstration project showcasing advanced AI and RAG architecture.
                            It is NOT:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
                            <li>A production-ready healthcare application</li>
                            <li>HIPAA-compliant for processing real PHI</li>
                            <li>Intended for actual medical claims adjudication</li>
                            <li>A substitute for professional medical billing services</li>
                        </ul>
                        <p className="text-slate-600 leading-relaxed">
                            Do not submit real patient data, actual insurance claims, or any Protected Health Information (PHI) to this demo.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Permitted Use</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            You may use this demo application to:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Explore the technical architecture and implementation</li>
                            <li>Test the AI-powered audit workflow with synthetic data</li>
                            <li>Evaluate the RAG pipeline and citation-gated decision making</li>
                            <li>Review the codebase for educational or recruitment purposes</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Prohibited Activities</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Submit real PHI or actual patient information</li>
                            <li>Attempt to reverse engineer or exploit the system</li>
                            <li>Use the demo for any commercial purposes</li>
                            <li>Overload the system with excessive requests</li>
                            <li>Misrepresent the demo as a production healthcare application</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The ClaimAudit demo application, including its architecture, code, and documentation,
                            is the intellectual property of its creator. The demo is provided for evaluation purposes,
                            and all rights are reserved unless explicitly stated otherwise.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            This demo is provided "as is" without warranties of any kind. The creator is not liable for
                            any damages arising from the use or inability to use this demonstration application.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. Continued use of the demo after
                            changes constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
                        <p className="text-slate-600 leading-relaxed">
                            For questions about these terms, please contact us at{" "}
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
