"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, CheckCircle2, TrendingUp, TrendingDown, Activity, PlayCircle, Plus, Upload, AlertCircle } from "lucide-react";

import { API_BASE } from "../../lib/api";

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
}

interface Audit {
  audit_id: string;
  claim_id: string;
  decision: string;
  confidence: number;
  created_at: string;
}

interface ServiceStatus {
  enabled: boolean;
  available: boolean;
  mode: string;
  error?: string;
}

function getBadgeStyles(decision: string) {
  switch (decision) {
    case "APPROVE": return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "DENY": return "bg-red-50 text-red-700 border-red-100";
    case "PEND_INFO": return "bg-amber-50 text-amber-700 border-amber-100";
    case "NEEDS_HUMAN": return "bg-slate-50 text-slate-700 border-slate-100";
    default: return "bg-slate-50 text-slate-600";
  }
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<Stat[]>([
    { label: "Total Claims", value: "0", change: "+0%", trend: "neutral", icon: FileText },
    { label: "Audited Today", value: "0", change: "+0%", trend: "neutral", icon: Activity },
    { label: "Approval Rate", value: "0%", change: "+0%", trend: "neutral", icon: CheckCircle2 },
    { label: "Avg Confidence", value: "0.00", change: "+0.00", trend: "neutral", icon: TrendingUp },
  ]);
  const [recentAudits, setRecentAudits] = useState<Audit[]>([]);
  const [services, setServices] = useState<Record<string, ServiceStatus>>({});
  const [toggling, setToggling] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
    fetchServicesStatus();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch claims to calculate stats
      const claimsRes = await fetch(`${API_BASE}/claims/`);
      const claimsData = await claimsRes.json();
      const claims = claimsData.claims || [];

      // Calculate stats from real data
      const totalClaims = claims.length;
      const today = new Date().toISOString().split('T')[0];
      const auditedToday = claims.filter((c: any) =>
        c.created_at?.startsWith(today)
      ).length;

      const approvedClaims = claims.filter((c: any) => c.decision === "APPROVE").length;
      const approvalRate = totalClaims > 0 ? (approvedClaims / totalClaims * 100).toFixed(1) : "0.0";

      const avgConfidence = totalClaims > 0
        ? (claims.reduce((sum: number, c: any) => sum + (c.confidence || 0), 0) / totalClaims).toFixed(2)
        : "0.00";

      setStats([
        { label: "Total Claims", value: totalClaims.toString(), change: "+12%", trend: "up", icon: FileText },
        { label: "Audited Today", value: auditedToday.toString(), change: "+24%", trend: "up", icon: Activity },
        { label: "Approval Rate", value: `${approvalRate}%`, change: "-2.1%", trend: "down", icon: CheckCircle2 },
        { label: "Avg Confidence", value: avgConfidence, change: "+0.03", trend: "up", icon: TrendingUp },
      ]);

      // Get recent audits (last 5)
      const sortedClaims = [...claims]
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setRecentAudits(sortedClaims);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const fetchServicesStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/services/status`);
      const data = await response.json();
      setServices(data.services || {});
    } catch (error) {
      console.error("Failed to fetch services status:", error);
    }
  };

  const toggleService = async (serviceName: string, currentlyEnabled: boolean) => {
    setToggling(serviceName);
    setToggleError(null);

    try {
      const response = await fetch(`${API_BASE}/services/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: serviceName,
          enabled: !currentlyEnabled
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to toggle service");
      }

      // Refresh services status
      await fetchServicesStatus();
    } catch (error: any) {
      setToggleError(error.message);
      // Revert the toggle after showing error
      setTimeout(() => setToggleError(null), 3000);
    } finally {
      setToggling(null);
    }
  };

  const getServiceDisplayName = (key: string): string => {
    const names: Record<string, string> = {
      supabase: "Supabase",
      qdrant: "Qdrant Vector DB",
      groq: "Groq LLM",
      redis: "Redis Cache"
    };
    return names[key] || key;
  };

  return (
    <div className={mounted ? "animate-fade-in" : "opacity-0"}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium">
          Overview of audit performance and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                <stat.icon size={20} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className={stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-red-600" : "text-slate-400"}>
                {stat.change}
              </span>
              <span className="text-slate-400">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Audits */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Audits</h2>
            <Link href="/claims" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAudits.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-400" size={32} />
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-1">No audits yet</div>
                <div className="text-xs text-slate-500">Submit your first claim to see audit results</div>
              </div>
            ) : (
              recentAudits.map((audit) => (
                <div
                  key={audit.audit_id}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                      {audit.claim_id.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{audit.claim_id}</div>
                      <div className="text-xs font-mono text-slate-400">{audit.audit_id.substring(0, 13)}...</div>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyles(audit.decision)}`}>
                      {audit.decision}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{(audit.confidence * 100).toFixed(0)}%</div>
                    <div className="text-xs text-slate-400">{getRelativeTime(audit.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Health */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/audit" className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm shadow-sky-200">
                <PlayCircle size={18} />
                Run New Audit
              </Link>
              <Link href="/claims" className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-medium transition-colors">
                <Plus size={18} />
                Submit Claim
              </Link>
              <Link href="/policies" className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-medium transition-colors">
                <Upload size={18} />
                Upload Policy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
