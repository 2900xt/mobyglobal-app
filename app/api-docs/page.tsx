"use client";

import { useState } from "react";

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("detections");

  const endpoints = {
    detections: {
      method: "GET",
      path: "/api/v1/detections",
      description: "Retrieve recent whale detections from the buoy network",
      auth: "Bearer Token",
      params: [
        { name: "limit", type: "integer", required: false, description: "Number of results to return (default: 50, max: 500)" },
        { name: "buoy_id", type: "string", required: false, description: "Filter by specific buoy ID" },
        { name: "species", type: "string", required: false, description: "Filter by whale species (e.g., 'humpback', 'blue', 'gray')" },
        { name: "since", type: "timestamp", required: false, description: "Get detections since this timestamp (ISO 8601)" },
      ],
      response: {
        detections: [
          {
            id: "det_9k2j3h4k5l6m",
            buoy_id: "buoy_001_sf_bay",
            timestamp: "2025-12-28T14:32:15Z",
            species: "humpback",
            confidence: 0.9784,
            location: {
              latitude: 37.8199,
              longitude: -122.4783,
            },
            acoustic_signature: "https://cdn.mobylabs.com/signatures/det_9k2j3h4k5l6m.wav",
          },
        ],
        count: 1,
        next_cursor: "eyJpZCI6ImRldF85azJqM2g0azVsNm0ifQ==",
      },
    },
    detectionById: {
      method: "GET",
      path: "/api/v1/detections/{id}",
      description: "Get detailed information about a specific detection",
      auth: "Bearer Token",
      params: [
        { name: "id", type: "string", required: true, description: "Detection ID" },
      ],
      response: {
        id: "det_9k2j3h4k5l6m",
        buoy_id: "buoy_001_sf_bay",
        timestamp: "2025-12-28T14:32:15Z",
        species: "humpback",
        confidence: 0.9784,
        location: {
          latitude: 37.8199,
          longitude: -122.4783,
        },
        acoustic_signature: "https://cdn.mobylabs.com/signatures/det_9k2j3h4k5l6m.wav",
        metadata: {
          water_temperature: 14.2,
          depth: 85.5,
          ambient_noise_level: 42.1,
        },
      },
    },
    buoys: {
      method: "GET",
      path: "/api/v1/buoys",
      description: "List all active buoys in your network",
      auth: "Bearer Token",
      params: [
        { name: "status", type: "string", required: false, description: "Filter by status ('active', 'maintenance', 'offline')" },
      ],
      response: {
        buoys: [
          {
            id: "buoy_001_sf_bay",
            name: "San Francisco Bay - North",
            status: "active",
            location: {
              latitude: 37.8199,
              longitude: -122.4783,
            },
            last_detection: "2025-12-28T14:32:15Z",
            battery_level: 87,
            uptime_percent: 99.2,
          },
          {
            id: "buoy_002_sf_bay",
            name: "San Francisco Bay - South",
            status: "active",
            location: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
            last_detection: "2025-12-28T13:15:42Z",
            battery_level: 92,
            uptime_percent: 98.8,
          },
        ],
        count: 2,
      },
    },
    alerts: {
      method: "POST",
      path: "/api/v1/alerts",
      description: "Create a custom alert for whale detections in a specific area",
      auth: "Bearer Token",
      params: [
        { name: "name", type: "string", required: true, description: "Alert name" },
        { name: "area", type: "object", required: true, description: "Geographic area (lat/lng bounds)" },
        { name: "species", type: "array", required: false, description: "Species to alert on (empty = all)" },
        { name: "webhook_url", type: "string", required: true, description: "URL to receive webhook notifications" },
      ],
      response: {
        id: "alert_xyz789",
        name: "Shipping Lane Monitor",
        status: "active",
        created_at: "2025-12-28T14:32:15Z",
      },
    },
  };

  type EndpointKey = keyof typeof endpoints;
  const currentEndpoint = endpoints[selectedEndpoint as EndpointKey];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Moby Labs API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access real-time whale detection data from any buoys in our global network.
          </p>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <p className="text-gray-700 mb-4">
            The Moby Labs API provides programmatic access to real-time whale detection data from our global buoy network.
            All API endpoints require authentication using a Bearer token.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-blue-600 mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Base URL</h3>
            <code className="text-blue-600 font-mono">https://api.mobylabs.com</code>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border-l-4 border-cyan-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Authentication</h3>
            <p className="text-gray-700 mb-2">Include your API key in the Authorization header:</p>
            <code className="block bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </div>

        {/* API Explorer */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Endpoints</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedEndpoint("detections")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedEndpoint === "detections"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xs font-bold">GET</span>
                  <br />
                  Detections
                </button>
                <button
                  onClick={() => setSelectedEndpoint("detectionById")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedEndpoint === "detectionById"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xs font-bold">GET</span>
                  <br />
                  Detection by ID
                </button>
                <button
                  onClick={() => setSelectedEndpoint("buoys")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedEndpoint === "buoys"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xs font-bold">GET</span>
                  <br />
                  Buoys
                </button>
                <button
                  onClick={() => setSelectedEndpoint("alerts")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedEndpoint === "alerts"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xs font-bold">POST</span>
                  <br />
                  Create Alert
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Method and Path */}
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  currentEndpoint.method === "GET"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}>
                  {currentEndpoint.method}
                </span>
                <code className="text-lg font-mono text-gray-900">{currentEndpoint.path}</code>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 text-lg">{currentEndpoint.description}</p>

              {/* Authentication */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-600 mb-2">AUTHENTICATION</h4>
                <span className="inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded font-semibold text-sm">
                  {currentEndpoint.auth}
                </span>
              </div>

              {/* Parameters */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-600 mb-3">PARAMETERS</h4>
                <div className="space-y-3">
                  {currentEndpoint.params.map((param, idx) => (
                    <div key={idx} className="border-l-4 border-blue-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="font-mono font-bold text-gray-900">{param.name}</code>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          {param.type}
                        </span>
                        {param.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                            required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{param.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Response */}
              <div>
                <h4 className="text-sm font-bold text-gray-600 mb-3">EXAMPLE RESPONSE</h4>
                <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
                  <pre className="font-mono text-sm">
                    {JSON.stringify(currentEndpoint.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Rate Limits */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 mt-6 border-l-4 border-amber-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rate Limits</h3>
              <p className="text-gray-700">
                Standard tier: <strong>1,000 requests/hour</strong> • Enterprise tier: <strong>10,000 requests/hour</strong>
              </p>
            </div>
          </div>
        </div>

        {/* SDKs */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Official SDKs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Python</h4>
              <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono mb-3">
                pip install mobylabs
              </code>
              <p className="text-gray-600 text-sm">Full SDK with async support</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg border-2 border-cyan-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">JavaScript</h4>
              <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono mb-3">
                npm i @mobylabs/sdk
              </code>
              <p className="text-gray-600 text-sm">Node.js and browser support</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Go</h4>
              <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono mb-3">
                go get mobylabs.com/sdk
              </code>
              <p className="text-gray-600 text-sm">Lightweight and performant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
