"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Activity,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Redirect unauthenticated users to signup
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signup");
    }
  }, [user, loading, router]);

  // Mock API key
  const apiKey = "mk_live_7f3d8a2b1c4e5f6g7h8i9j0k1l2m3n4o";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.user_metadata?.firstName || "Developer";

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-white/60">
            Manage your Moby Labs API access and monitor your usage.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-sm">API Requests Today</span>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">1,247</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% from yesterday
            </p>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-sm">Requests Remaining</span>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">8,753</p>
            <p className="text-xs text-white/50 mt-1">of 10,000 / month</p>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-sm">Avg Response Time</span>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">142ms</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              -8ms from last week
            </p>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-sm">Success Rate</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">99.8%</p>
            <p className="text-xs text-white/50 mt-1">Last 30 days</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Key Section */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">API Key</h2>
            </div>

            <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm text-white/80 font-mono flex-1 overflow-hidden">
                  {showApiKey ? apiKey : "mk_live_••••••••••••••••••••••••••••"}
                </code>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy API key"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-200/80">
                Keep your API key secure. Do not share it publicly or commit it
                to version control.
              </p>
            </div>

            {/* Quick Start */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-3">
                Quick Start
              </h3>
              <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-white/80 font-mono whitespace-pre">
                  <span className="text-purple-400">curl</span>{" "}
                  <span className="text-cyan-400">
                    -X GET &quot;https://api.mobylabs.io/v1/whales&quot;
                  </span>{" "}
                  \{"\n"}
                  {"  "}
                  <span className="text-yellow-400">-H</span>{" "}
                  <span className="text-emerald-400">
                    &quot;Authorization: Bearer $API_KEY&quot;
                  </span>
                </pre>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Recent Activity
              </h2>
              <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  endpoint: "GET /v1/whales",
                  status: 200,
                  time: "2 min ago",
                },
                {
                  endpoint: "GET /v1/whales/123",
                  status: 200,
                  time: "5 min ago",
                },
                {
                  endpoint: "GET /v1/sightings",
                  status: 200,
                  time: "12 min ago",
                },
                {
                  endpoint: "POST /v1/alerts",
                  status: 201,
                  time: "18 min ago",
                },
                {
                  endpoint: "GET /v1/whales",
                  status: 429,
                  time: "1 hr ago",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-sm text-white font-mono">
                      {item.endpoint}
                    </p>
                    <p className="text-xs text-white/50">{item.time}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      item.status >= 200 && item.status < 300
                        ? "bg-emerald-500/20 text-emerald-400"
                        : item.status >= 400
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              View all activity →
            </button>
          </div>
        </div>
        </div>
    </div>
  );
}
