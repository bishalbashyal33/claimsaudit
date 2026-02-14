"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlayCircle, BookOpen, MessageSquare, Settings, CheckCircle2 } from "lucide-react";

// Update navigation paths and labels
const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/claims", label: "Claims", icon: FileText },
    { href: "/audit", label: "Run Audit", icon: PlayCircle },
    { href: "/policies", label: "Policies", icon: BookOpen },
    { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

const bottomItems = [
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            className="fixed top-0 left-0 bottom-0 flex flex-col z-50 bg-slate-50 border-r border-slate-200"
            style={{ width: 260 }}
        >
            {/* Logo */}
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
                        CA
                    </div>
                    <div>
                        <div className="font-bold text-base text-slate-900 tracking-tight">
                            ClaimAudit
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
                            APCA Engine
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-sky-50 text-sky-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            <item.icon size={18} className={isActive ? "text-sky-600" : "text-slate-400"} />
                            {item.label}
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-slate-200">
                {bottomItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                        <item.icon size={18} className="text-slate-400" />
                        {item.label}
                    </Link>
                ))}

                {/* Status */}
                <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-700">System Online</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                        v0.1.0 · Mock Mode
                    </div>
                </div>
            </div>
        </aside>
    );
}
