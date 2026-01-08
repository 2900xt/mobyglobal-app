"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Book,
  Copy,
  CheckCircle2,
  Key,
  Zap,
  AlertTriangle,
  Code,
  Server,
  Globe,
  Shield,
  FileJson,
  Webhook,
} from "lucide-react";

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

export default function DocsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signup");
    }
  }, [user, loading, router]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const sections: Section[] = [
    { id: "introduction", title: "Introduction", icon: <Book className="w-4 h-4" /> },
    { id: "authentication", title: "Authentication", icon: <Key className="w-4 h-4" /> },
    { id: "quickstart", title: "Quick Start", icon: <Zap className="w-4 h-4" /> },
    { id: "whales", title: "Whales", icon: <Globe className="w-4 h-4" /> },
    { id: "sightings", title: "Sightings", icon: <Server className="w-4 h-4" /> },
    { id: "alerts", title: "Alerts & Webhooks", icon: <Webhook className="w-4 h-4" /> },
    { id: "regions", title: "Regions", icon: <Globe className="w-4 h-4" /> },
    { id: "species", title: "Species", icon: <FileJson className="w-4 h-4" /> },
    { id: "errors", title: "Error Handling", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "ratelimits", title: "Rate Limits", icon: <Shield className="w-4 h-4" /> },
  ];

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => handleCopy(text, id)}
      className="absolute top-2 right-2 p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors"
      title="Copy to clipboard"
    >
      {copiedText === id ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );

  const MethodBadge = ({ method }: { method: string }) => {
    const colors: Record<string, string> = {
      GET: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      POST: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
      PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return (
      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colors[method]}`}>
        {method}
      </span>
    );
  };

  const CodeBlock = ({ code, language = "bash", id }: { code: string; language?: string; id: string }) => (
    <div className="relative bg-slate-900 border border-white/10 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 border-b border-white/10">
        <span className="text-xs text-white/50">{language}</span>
        <CopyButton text={code} id={id} />
      </div>
      <pre className="p-3 overflow-x-auto text-sm font-mono text-white/80 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );

  const ParamTable = ({ params }: { params: { name: string; type: string; required?: boolean; description: string }[] }) => (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800/50">
          <tr>
            <th className="text-left px-3 py-2 text-white/70 font-medium">Parameter</th>
            <th className="text-left px-3 py-2 text-white/70 font-medium">Type</th>
            <th className="text-left px-3 py-2 text-white/70 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {params.map((p) => (
            <tr key={p.name} className="bg-slate-900/30">
              <td className="px-3 py-2">
                <code className="text-cyan-400">{p.name}</code>
                {p.required && <span className="ml-1 text-red-400 text-xs">*</span>}
              </td>
              <td className="px-3 py-2 text-white/50">{p.type}</td>
              <td className="px-3 py-2 text-white/70">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-14">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 fixed left-0 top-14 bottom-0 bg-slate-900/50 border-r border-white/10 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white">API Docs</span>
            </div>
            <div className="text-xs text-white/40 mb-2 px-2">v1.0.0</div>
            <nav className="space-y-0.5">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
                    activeSection === section.id
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-56 px-8 py-6 max-w-4xl">
          {/* Introduction */}
          <section id="introduction" className="mb-10">
            <h1 className="text-2xl font-bold text-white mb-3">Moby Labs API Documentation</h1>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              The Moby Labs API provides programmatic access to real-time whale tracking data, sightings, and alerts.
              Use our RESTful API to integrate whale monitoring into your applications, research projects, or maritime operations.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">Base URL</p>
                <code className="text-cyan-400 text-sm">api.mobylabs.io</code>
              </div>
              <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">Version</p>
                <code className="text-cyan-400 text-sm">v1</code>
              </div>
              <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">Format</p>
                <code className="text-cyan-400 text-sm">JSON</code>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              Authentication
            </h2>
            <p className="text-white/70 text-sm mb-3">
              All API requests require authentication via Bearer token. Include your API key in the <code className="text-cyan-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">Authorization</code> header.
            </p>
            <CodeBlock
              id="auth-header"
              language="http"
              code={`Authorization: Bearer mk_live_your_api_key_here`}
            />
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-200/80">
                Never expose your API key in client-side code. Use environment variables and server-side requests.
              </p>
            </div>
          </section>

          {/* Quick Start */}
          <section id="quickstart" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Quick Start
            </h2>
            <p className="text-white/70 text-sm mb-3">Make your first API call in seconds:</p>
            <CodeBlock
              id="quickstart-curl"
              language="bash"
              code={`curl -X GET "https://api.mobylabs.io/v1/whales?limit=5" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            />
            <div className="mt-4">
              <p className="text-xs text-white/50 mb-2">Response</p>
              <CodeBlock
                id="quickstart-response"
                language="json"
                code={`{
  "data": [
    { "id": "whl_abc123", "name": "Luna", "species": "Humpback", "status": "active" },
    { "id": "whl_def456", "name": "Echo", "species": "Blue Whale", "status": "migrating" }
  ],
  "meta": { "total": 1247, "limit": 5, "offset": 0 }
}`}
              />
            </div>
          </section>

          {/* Whales */}
          <section id="whales" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Whales</h2>

            {/* List Whales */}
            <div className="bg-slate-900/30 border border-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="GET" />
                <code className="text-white text-sm">/v1/whales</code>
                <span className="text-white/50 text-sm ml-auto">List all tracked whales</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-white/70 mb-2">Query Parameters</p>
                  <ParamTable params={[
                    { name: "limit", type: "integer", description: "Results per page (default: 50, max: 100)" },
                    { name: "offset", type: "integer", description: "Pagination offset" },
                    { name: "species", type: "string", description: "Filter by species (e.g., humpback, orca)" },
                    { name: "status", type: "string", description: "Filter by status: active, migrating, inactive" },
                    { name: "region", type: "string", description: "Filter by region code" },
                  ]} />
                </div>
                <CodeBlock
                  id="whales-list"
                  language="bash"
                  code={`curl "https://api.mobylabs.io/v1/whales?species=humpback&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                />
              </div>
            </div>

            {/* Get Whale */}
            <div className="bg-slate-900/30 border border-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="GET" />
                <code className="text-white text-sm">/v1/whales/:id</code>
                <span className="text-white/50 text-sm ml-auto">Get whale details</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-white/70 mb-2">Path Parameters</p>
                  <ParamTable params={[
                    { name: "id", type: "string", required: true, description: "Whale ID (e.g., whl_abc123)" },
                  ]} />
                </div>
                <CodeBlock
                  id="whales-get-response"
                  language="json"
                  code={`{
  "id": "whl_abc123",
  "name": "Luna",
  "species": "Humpback",
  "scientific_name": "Megaptera novaeangliae",
  "estimated_age": 12,
  "length_meters": 14.5,
  "weight_tons": 30,
  "first_sighted": "2018-03-22T00:00:00Z",
  "sighting_count": 47,
  "last_location": { "lat": 34.0522, "lng": -118.2437 },
  "last_seen": "2024-01-15T10:30:00Z",
  "migration_pattern": "California to Alaska",
  "status": "active",
  "tags": ["tagged", "photo-id"]
}`}
                />
              </div>
            </div>

            {/* Get Whale History */}
            <div className="bg-slate-900/30 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="GET" />
                <code className="text-white text-sm">/v1/whales/:id/history</code>
                <span className="text-white/50 text-sm ml-auto">Get whale location history</span>
              </div>
              <div className="p-4 space-y-4">
                <ParamTable params={[
                  { name: "id", type: "string", required: true, description: "Whale ID" },
                  { name: "start_date", type: "string", description: "ISO 8601 start date" },
                  { name: "end_date", type: "string", description: "ISO 8601 end date" },
                  { name: "interval", type: "string", description: "Grouping: hour, day, week (default: day)" },
                ]} />
              </div>
            </div>
          </section>

          {/* Sightings */}
          <section id="sightings" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Sightings</h2>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="GET" />
                <code className="text-white text-sm">/v1/sightings</code>
                <span className="text-white/50 text-sm ml-auto">List recent sightings</span>
              </div>
              <div className="p-4 space-y-4">
                <ParamTable params={[
                  { name: "whale_id", type: "string", description: "Filter by specific whale" },
                  { name: "region", type: "string", description: "Filter by region code" },
                  { name: "since", type: "string", description: "ISO 8601 timestamp" },
                  { name: "until", type: "string", description: "ISO 8601 timestamp" },
                  { name: "source", type: "string", description: "Filter by source: satellite, acoustic, visual" },
                  { name: "min_confidence", type: "number", description: "Minimum confidence score (0-1)" },
                ]} />
                <CodeBlock
                  id="sightings-response"
                  language="json"
                  code={`{
  "data": [
    {
      "id": "sgt_xyz789",
      "whale_id": "whl_abc123",
      "whale_name": "Luna",
      "timestamp": "2024-01-15T10:30:00Z",
      "location": { "lat": 34.0522, "lng": -118.2437 },
      "confidence": 0.95,
      "source": "satellite",
      "region": "southern_california",
      "behavior": "feeding"
    }
  ],
  "meta": { "total": 156, "limit": 50, "offset": 0 }
}`}
                />
              </div>
            </div>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="POST" />
                <code className="text-white text-sm">/v1/sightings</code>
                <span className="text-white/50 text-sm ml-auto">Report a sighting</span>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-xs text-white/70 mb-2">Request Body</p>
                <ParamTable params={[
                  { name: "lat", type: "number", required: true, description: "Latitude (-90 to 90)" },
                  { name: "lng", type: "number", required: true, description: "Longitude (-180 to 180)" },
                  { name: "species", type: "string", required: true, description: "Species identification" },
                  { name: "whale_id", type: "string", description: "Known whale ID if identified" },
                  { name: "timestamp", type: "string", description: "ISO 8601 timestamp (defaults to now)" },
                  { name: "notes", type: "string", description: "Additional observations" },
                  { name: "image_url", type: "string", description: "URL to sighting photo" },
                ]} />
              </div>
            </div>
          </section>

          {/* Alerts */}
          <section id="alerts" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Alerts & Webhooks</h2>
            <p className="text-white/70 text-sm mb-3">
              Set up real-time notifications when whales are detected in specific regions.
            </p>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="POST" />
                <code className="text-white text-sm">/v1/alerts</code>
                <span className="text-white/50 text-sm ml-auto">Create alert</span>
              </div>
              <div className="p-4 space-y-4">
                <ParamTable params={[
                  { name: "name", type: "string", required: true, description: "Alert name" },
                  { name: "region", type: "string", required: true, description: "Region code to monitor" },
                  { name: "webhook_url", type: "string", required: true, description: "URL to receive notifications" },
                  { name: "species", type: "string[]", description: "Filter by species (empty = all)" },
                  { name: "min_confidence", type: "number", description: "Minimum confidence threshold" },
                  { name: "cooldown_minutes", type: "integer", description: "Minutes between alerts (default: 30)" },
                ]} />
                <CodeBlock
                  id="alert-create"
                  language="bash"
                  code={`curl -X POST "https://api.mobylabs.io/v1/alerts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Pacific Northwest Orcas",
    "region": "pacific_northwest",
    "webhook_url": "https://your-app.com/webhooks/whales",
    "species": ["Orca"],
    "min_confidence": 0.8
  }'`}
                />
              </div>
            </div>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="GET" />
                <code className="text-white text-sm">/v1/alerts</code>
                <span className="text-white/50 text-sm ml-auto">List your alerts</span>
              </div>
            </div>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="DELETE" />
                <code className="text-white text-sm">/v1/alerts/:id</code>
                <span className="text-white/50 text-sm ml-auto">Delete alert</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/50 border border-white/10 rounded-lg">
              <p className="text-xs font-medium text-white/70 mb-2">Webhook Payload</p>
              <CodeBlock
                id="webhook-payload"
                language="json"
                code={`{
  "event": "whale.detected",
  "alert_id": "alt_def456",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "sighting_id": "sgt_xyz789",
    "whale_id": "whl_abc123",
    "whale_name": "Luna",
    "species": "Orca",
    "location": { "lat": 47.6062, "lng": -122.3321 },
    "confidence": 0.92,
    "region": "pacific_northwest"
  }
}`}
              />
            </div>
          </section>

          {/* Regions */}
          <section id="regions" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Regions</h2>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg mb-4">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="GET" />
                <code className="text-white text-sm">/v1/regions</code>
                <span className="text-white/50 text-sm ml-auto">List monitored regions</span>
              </div>
              <div className="p-4">
                <CodeBlock
                  id="regions-response"
                  language="json"
                  code={`{
  "data": [
    {
      "code": "pacific_northwest",
      "name": "Pacific Northwest",
      "bounds": { "north": 50.0, "south": 42.0, "east": -122.0, "west": -130.0 },
      "active_whales": 156,
      "coverage": "high"
    },
    {
      "code": "southern_california",
      "name": "Southern California",
      "bounds": { "north": 35.0, "south": 32.0, "east": -117.0, "west": -122.0 },
      "active_whales": 89,
      "coverage": "high"
    }
  ]
}`}
                />
              </div>
            </div>
          </section>

          {/* Species */}
          <section id="species" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Species</h2>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <MethodBadge method="GET" />
                <code className="text-white text-sm">/v1/species</code>
                <span className="text-white/50 text-sm ml-auto">List whale species</span>
              </div>
              <div className="p-4">
                <CodeBlock
                  id="species-response"
                  language="json"
                  code={`{
  "data": [
    {
      "id": "humpback",
      "name": "Humpback Whale",
      "scientific_name": "Megaptera novaeangliae",
      "tracked_count": 523,
      "avg_length_m": 14.5,
      "conservation_status": "Least Concern"
    },
    {
      "id": "blue_whale",
      "name": "Blue Whale",
      "scientific_name": "Balaenoptera musculus",
      "tracked_count": 187,
      "avg_length_m": 25.0,
      "conservation_status": "Endangered"
    },
    {
      "id": "orca",
      "name": "Orca (Killer Whale)",
      "scientific_name": "Orcinus orca",
      "tracked_count": 312,
      "avg_length_m": 7.0,
      "conservation_status": "Data Deficient"
    }
  ]
}`}
                />
              </div>
            </div>
          </section>

          {/* Errors */}
          <section id="errors" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Error Handling</h2>
            <p className="text-white/70 text-sm mb-3">
              The API uses standard HTTP status codes. Errors return a consistent JSON structure:
            </p>
            <CodeBlock
              id="error-format"
              language="json"
              code={`{
  "error": {
    "code": "invalid_request",
    "message": "The 'limit' parameter must be between 1 and 100",
    "param": "limit",
    "status": 400
  }
}`}
            />
            <div className="mt-4 border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left px-3 py-2 text-white/70 font-medium">Status</th>
                    <th className="text-left px-3 py-2 text-white/70 font-medium">Code</th>
                    <th className="text-left px-3 py-2 text-white/70 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="bg-slate-900/30">
                    <td className="px-3 py-2 text-yellow-400">400</td>
                    <td className="px-3 py-2 text-white/70">invalid_request</td>
                    <td className="px-3 py-2 text-white/50">Invalid parameters or malformed request</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="px-3 py-2 text-red-400">401</td>
                    <td className="px-3 py-2 text-white/70">unauthorized</td>
                    <td className="px-3 py-2 text-white/50">Missing or invalid API key</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="px-3 py-2 text-red-400">403</td>
                    <td className="px-3 py-2 text-white/70">forbidden</td>
                    <td className="px-3 py-2 text-white/50">Insufficient permissions</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="px-3 py-2 text-orange-400">404</td>
                    <td className="px-3 py-2 text-white/70">not_found</td>
                    <td className="px-3 py-2 text-white/50">Resource does not exist</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="px-3 py-2 text-orange-400">429</td>
                    <td className="px-3 py-2 text-white/70">rate_limited</td>
                    <td className="px-3 py-2 text-white/50">Too many requests</td>
                  </tr>
                  <tr className="bg-slate-900/30">
                    <td className="px-3 py-2 text-red-400">500</td>
                    <td className="px-3 py-2 text-white/70">server_error</td>
                    <td className="px-3 py-2 text-white/50">Internal server error</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Rate Limits */}
          <section id="ratelimits" className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3">Rate Limits</h2>
            <p className="text-white/70 text-sm mb-3">
              Rate limits are applied per API key. Headers are included in every response:
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">1,000</p>
                <p className="text-xs text-white/50">requests/hour</p>
              </div>
              <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">10,000</p>
                <p className="text-xs text-white/50">requests/month</p>
              </div>
              <div className="bg-slate-900/50 border border-white/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">100</p>
                <p className="text-xs text-white/50">concurrent</p>
              </div>
            </div>
            <CodeBlock
              id="rate-limit-headers"
              language="http"
              code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1705332000`}
            />
          </section>

          {/* Footer */}
          <div className="border-t border-white/10 pt-6 mt-10">
            <p className="text-xs text-white/40 text-center">
              Need help? Contact us at{" "}
              <a href="mailto:api@mobylabs.io" className="text-cyan-400 hover:underline">
                api@mobylabs.io
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
