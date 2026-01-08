"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Book, ChevronRight, Copy, CheckCircle2 } from "lucide-react";

export default function DocsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signup");
    }
  }, [user, loading, router]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const endpoints = [
    {
      id: "list-whales",
      method: "GET",
      path: "/v1/whales",
      description: "Retrieve a list of all tracked whales in the system.",
      parameters: [
        { name: "limit", type: "number", description: "Max results (default: 50)" },
        { name: "offset", type: "number", description: "Pagination offset" },
        { name: "species", type: "string", description: "Filter by species" },
      ],
      response: `{
  "whales": [
    {
      "id": "whl_abc123",
      "name": "Luna",
      "species": "Humpback",
      "last_seen": "2024-01-15T10:30:00Z",
      "location": { "lat": 34.0522, "lng": -118.2437 }
    }
  ],
  "total": 1247,
  "has_more": true
}`,
    },
    {
      id: "get-whale",
      method: "GET",
      path: "/v1/whales/:id",
      description: "Get detailed information about a specific whale.",
      parameters: [
        { name: "id", type: "string", description: "Whale ID (required)" },
      ],
      response: `{
  "id": "whl_abc123",
  "name": "Luna",
  "species": "Humpback",
  "estimated_age": 12,
  "length_meters": 14.5,
  "first_sighted": "2018-03-22",
  "sighting_count": 47,
  "last_location": { "lat": 34.0522, "lng": -118.2437 },
  "migration_pattern": "California to Alaska"
}`,
    },
    {
      id: "list-sightings",
      method: "GET",
      path: "/v1/sightings",
      description: "Get recent whale sightings with location data.",
      parameters: [
        { name: "whale_id", type: "string", description: "Filter by whale" },
        { name: "region", type: "string", description: "Filter by region code" },
        { name: "since", type: "string", description: "ISO date for start range" },
      ],
      response: `{
  "sightings": [
    {
      "id": "sgt_xyz789",
      "whale_id": "whl_abc123",
      "timestamp": "2024-01-15T10:30:00Z",
      "location": { "lat": 34.0522, "lng": -118.2437 },
      "confidence": 0.95,
      "source": "satellite"
    }
  ]
}`,
    },
    {
      id: "create-alert",
      method: "POST",
      path: "/v1/alerts",
      description: "Create a location-based alert for whale activity.",
      parameters: [
        { name: "region", type: "string", description: "Region code (required)" },
        { name: "webhook_url", type: "string", description: "URL to notify" },
        { name: "species", type: "string[]", description: "Species to track" },
      ],
      response: `{
  "id": "alt_def456",
  "region": "pacific_northwest",
  "webhook_url": "https://your-app.com/webhook",
  "species": ["Humpback", "Orca"],
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}`,
    },
    {
      id: "list-regions",
      method: "GET",
      path: "/v1/regions",
      description: "List all monitored ocean regions.",
      parameters: [],
      response: `{
  "regions": [
    {
      "code": "pacific_northwest",
      "name": "Pacific Northwest",
      "bounds": {
        "north": 50.0, "south": 42.0,
        "east": -122.0, "west": -130.0
      },
      "active_whales": 156
    }
  ]
}`,
    },
    {
      id: "list-species",
      method: "GET",
      path: "/v1/species",
      description: "Get information about tracked whale species.",
      parameters: [],
      response: `{
  "species": [
    {
      "id": "humpback",
      "name": "Humpback Whale",
      "scientific_name": "Megaptera novaeangliae",
      "tracked_count": 523,
      "conservation_status": "Least Concern"
    }
  ]
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Book className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">API Documentation</h1>
          </div>
          <p className="text-white/60">
            Complete reference for the Moby Labs Whale Tracking API.
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Base URL</h2>
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 font-mono text-cyan-400">
            https://api.mobylabs.io
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Authentication</h2>
          <p className="text-white/70 text-sm mb-4">
            All API requests require a Bearer token in the Authorization header.
          </p>
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 font-mono text-sm">
            <span className="text-yellow-400">Authorization:</span>{" "}
            <span className="text-emerald-400">Bearer YOUR_API_KEY</span>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Endpoints</h2>

          {endpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded ${
                      endpoint.method === "GET"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-white font-mono">{endpoint.path}</code>
                  <button
                    onClick={() => handleCopy(`https://api.mobylabs.io${endpoint.path}`, endpoint.id)}
                    className="ml-auto p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    {copiedEndpoint === endpoint.id ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-white/70 text-sm">{endpoint.description}</p>
              </div>

              {endpoint.parameters.length > 0 && (
                <div className="p-6 border-b border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-3">Parameters</h4>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param) => (
                      <div key={param.name} className="flex items-start gap-3 text-sm">
                        <code className="text-cyan-400 bg-slate-800/50 px-2 py-0.5 rounded">
                          {param.name}
                        </code>
                        <span className="text-white/50">{param.type}</span>
                        <span className="text-white/70">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6">
                <h4 className="text-sm font-semibold text-white mb-3">Response</h4>
                <pre className="bg-slate-800/50 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm font-mono text-white/80">
                  {endpoint.response}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-white mb-3">Rate Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/30 rounded-lg p-4">
              <p className="text-2xl font-bold text-white">1,000</p>
              <p className="text-sm text-white/50">Requests per hour</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4">
              <p className="text-2xl font-bold text-white">10,000</p>
              <p className="text-sm text-white/50">Requests per month</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4">
              <p className="text-2xl font-bold text-white">100</p>
              <p className="text-sm text-white/50">Concurrent connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
