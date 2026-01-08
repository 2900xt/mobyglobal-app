"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, RefreshCw, Clock } from "lucide-react";

type LogEntry = {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  latency: number;
  ip: string;
};

export default function LogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signup");
    }
  }, [user, loading, router]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const mockLogs: LogEntry[] = [
    { id: "1", timestamp: "2024-01-15T14:32:15Z", method: "GET", endpoint: "/v1/whales", status: 200, latency: 124, ip: "192.168.1.1" },
    { id: "2", timestamp: "2024-01-15T14:31:42Z", method: "GET", endpoint: "/v1/whales/whl_abc123", status: 200, latency: 89, ip: "192.168.1.1" },
    { id: "3", timestamp: "2024-01-15T14:30:55Z", method: "POST", endpoint: "/v1/alerts", status: 201, latency: 234, ip: "192.168.1.1" },
    { id: "4", timestamp: "2024-01-15T14:28:12Z", method: "GET", endpoint: "/v1/sightings", status: 200, latency: 156, ip: "10.0.0.5" },
    { id: "5", timestamp: "2024-01-15T14:25:33Z", method: "GET", endpoint: "/v1/whales", status: 429, latency: 12, ip: "192.168.1.1" },
    { id: "6", timestamp: "2024-01-15T14:22:18Z", method: "GET", endpoint: "/v1/regions", status: 200, latency: 98, ip: "10.0.0.5" },
    { id: "7", timestamp: "2024-01-15T14:20:45Z", method: "GET", endpoint: "/v1/whales/invalid", status: 404, latency: 45, ip: "192.168.1.1" },
    { id: "8", timestamp: "2024-01-15T14:18:30Z", method: "POST", endpoint: "/v1/alerts", status: 400, latency: 67, ip: "10.0.0.5" },
    { id: "9", timestamp: "2024-01-15T14:15:22Z", method: "GET", endpoint: "/v1/species", status: 200, latency: 112, ip: "192.168.1.1" },
    { id: "10", timestamp: "2024-01-15T14:12:11Z", method: "GET", endpoint: "/v1/whales", status: 200, latency: 134, ip: "10.0.0.5" },
    { id: "11", timestamp: "2024-01-15T14:10:05Z", method: "GET", endpoint: "/v1/sightings", status: 500, latency: 2345, ip: "192.168.1.1" },
    { id: "12", timestamp: "2024-01-15T14:08:33Z", method: "GET", endpoint: "/v1/whales", status: 200, latency: 118, ip: "192.168.1.1" },
  ];

  const filteredLogs = mockLogs.filter((log) => {
    if (filter === "success") return log.status >= 200 && log.status < 300;
    if (filter === "error") return log.status >= 400;
    return true;
  });

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-emerald-500/20 text-emerald-400";
    if (status >= 300 && status < 400) return "bg-yellow-500/20 text-yellow-400";
    if (status >= 400 && status < 500) return "bg-orange-500/20 text-orange-400";
    return "bg-red-500/20 text-red-400";
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return "text-emerald-400";
    if (latency < 300) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl font-bold text-white">API Logs</h1>
            </div>
            <p className="text-white/60">
              Monitor your API requests in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800/50 border border-white/10 rounded-lg p-1">
              {(["all", "success", "error"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    filter === f
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-white">{mockLogs.length}</p>
          </div>
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-emerald-400">
              {Math.round((mockLogs.filter(l => l.status < 400).length / mockLogs.length) * 100)}%
            </p>
          </div>
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Avg Latency</p>
            <p className="text-2xl font-bold text-white">
              {Math.round(mockLogs.reduce((a, b) => a + b.latency, 0) / mockLogs.length)}ms
            </p>
          </div>
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Errors</p>
            <p className="text-2xl font-bold text-red-400">
              {mockLogs.filter(l => l.status >= 400).length}
            </p>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-semibold text-white/60 px-4 py-3">Time</th>
                  <th className="text-left text-xs font-semibold text-white/60 px-4 py-3">Method</th>
                  <th className="text-left text-xs font-semibold text-white/60 px-4 py-3">Endpoint</th>
                  <th className="text-left text-xs font-semibold text-white/60 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-white/60 px-4 py-3">Latency</th>
                  <th className="text-left text-xs font-semibold text-white/60 px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          log.method === "GET"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : log.method === "POST"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm text-white font-mono">{log.endpoint}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${getStatusColor(log.status)}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-mono ${getLatencyColor(log.latency)}`}>
                        {log.latency}ms
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white/50 font-mono">{log.ip}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-white/50">
              Showing {filteredLogs.length} of {mockLogs.length} requests
            </p>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              Load more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
