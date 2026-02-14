import Link from "next/link";
import { Mail, Github, Linkedin, Send } from "lucide-react";

export default function ContactPage() {
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
            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Get in Touch</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Interested in discussing the technical implementation, exploring collaboration opportunities,
                        or have questions about the architecture?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="text-sky-600" size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 mb-1">Email</div>
                                    <a href="mailto:demo@claimaudit.com" className="text-sky-600 hover:text-sky-700 transition-colors">
                                        demo@claimaudit.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <Github className="text-slate-600" size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 mb-1">GitHub</div>
                                    <a href="#" className="text-sky-600 hover:text-sky-700 transition-colors">
                                        View Source Code
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Linkedin className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 mb-1">LinkedIn</div>
                                    <a href="#" className="text-sky-600 hover:text-sky-700 transition-colors">
                                        Connect on LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h3 className="font-semibold text-slate-900 mb-3">Technical Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Next.js", "FastAPI", "LangGraph", "Qdrant", "OpenAI", "Groq", "Supabase"].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>

                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="What would you like to discuss?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                                <textarea
                                    className="input-field min-h-[150px]"
                                    placeholder="Tell me about your interest in the project..."
                                    rows={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3.5 rounded-lg font-semibold shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-8 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Explore the Demo</h3>
                    <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                        Experience the AI-powered claims auditing system in action with our interactive demo.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                        Launch Demo Dashboard
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-200">
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
