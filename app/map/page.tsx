"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, Waves, Clock } from "lucide-react";

type WhaleSighting = {
  id: string;
  name: string;
  species: string;
  lat: number;
  lng: number;
  lastSeen: string;
  status: "active" | "migrating" | "inactive";
};

export default function MapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedWhale, setSelectedWhale] = useState<WhaleSighting | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "migrating">("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signup");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const mockWhales: WhaleSighting[] = [
    { id: "1", name: "Luna", species: "Humpback", lat: 34.0522, lng: -118.2437, lastSeen: "2 min ago", status: "active" },
    { id: "2", name: "Echo", species: "Blue Whale", lat: 36.7783, lng: -119.4179, lastSeen: "15 min ago", status: "active" },
    { id: "3", name: "Storm", species: "Orca", lat: 47.6062, lng: -122.3321, lastSeen: "1 hr ago", status: "migrating" },
    { id: "4", name: "Pearl", species: "Gray Whale", lat: 32.7157, lng: -117.1611, lastSeen: "3 min ago", status: "active" },
    { id: "5", name: "Atlas", species: "Sperm Whale", lat: 21.3069, lng: -157.8583, lastSeen: "45 min ago", status: "migrating" },
    { id: "6", name: "Coral", species: "Humpback", lat: 37.7749, lng: -122.4194, lastSeen: "5 min ago", status: "active" },
    { id: "7", name: "Neptune", species: "Blue Whale", lat: 33.4484, lng: -112.0740, lastSeen: "2 days ago", status: "inactive" },
    { id: "8", name: "Drift", species: "Orca", lat: 48.4284, lng: -123.3656, lastSeen: "30 min ago", status: "active" },
  ];

  const filteredWhales = mockWhales.filter((whale) => {
    if (filter === "all") return true;
    return whale.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500";
      case "migrating": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "migrating": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-slate-900/80 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Waves className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Whale Tracker</h2>
            </div>

            <div className="flex bg-slate-800/50 border border-white/10 rounded-lg p-1">
              {(["all", "active", "migrating"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filter === f
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredWhales.map((whale) => (
              <button
                key={whale.id}
                onClick={() => setSelectedWhale(whale)}
                className={`w-full p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors ${
                  selectedWhale?.id === whale.id ? "bg-white/10" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(whale.status)}`} />
                    <span className="font-semibold text-white">{whale.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(whale.status)}`}>
                    {whale.status}
                  </span>
                </div>
                <p className="text-sm text-white/60">{whale.species}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  {whale.lastSeen}
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Total tracked</span>
              <span className="text-white font-semibold">{filteredWhales.length} whales</span>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-950">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.3) 0%, transparent 25%),
                radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 30%),
                radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 20%)
              `,
            }} />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>

          {/* Map Placeholder Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
              <p className="text-white/30 text-lg">Interactive Map</p>
              <p className="text-white/20 text-sm mt-1">Map integration coming soon</p>
            </div>
          </div>

          {/* Whale Markers (positioned randomly for demo) */}
          {filteredWhales.map((whale, index) => (
            <button
              key={whale.id}
              onClick={() => setSelectedWhale(whale)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                selectedWhale?.id === whale.id ? "scale-125 z-20" : "hover:scale-110 z-10"
              }`}
              style={{
                left: `${15 + (index * 10) % 70}%`,
                top: `${20 + (index * 12) % 60}%`,
              }}
            >
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(whale.status)} shadow-lg`}>
                  {whale.status === "active" && (
                    <div className={`absolute inset-0 rounded-full ${getStatusColor(whale.status)} animate-ping opacity-50`} />
                  )}
                </div>
                {selectedWhale?.id === whale.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-800 border border-white/20 rounded-lg p-3 whitespace-nowrap shadow-xl">
                    <p className="font-semibold text-white">{whale.name}</p>
                    <p className="text-xs text-white/60">{whale.species}</p>
                    <p className="text-xs text-cyan-400 mt-1">
                      {whale.lat.toFixed(4)}, {whale.lng.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-white/10 rounded-lg p-4">
            <p className="text-xs font-semibold text-white mb-2">Status</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-white/70">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs text-white/70">Migrating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-xs text-white/70">Inactive</span>
              </div>
            </div>
          </div>

          {/* Stats overlay */}
          <div className="absolute top-4 left-4 flex gap-3">
            <div className="bg-slate-900/90 border border-white/10 rounded-lg px-4 py-2">
              <p className="text-xs text-white/60">Active</p>
              <p className="text-lg font-bold text-emerald-400">
                {mockWhales.filter(w => w.status === "active").length}
              </p>
            </div>
            <div className="bg-slate-900/90 border border-white/10 rounded-lg px-4 py-2">
              <p className="text-xs text-white/60">Migrating</p>
              <p className="text-lg font-bold text-yellow-400">
                {mockWhales.filter(w => w.status === "migrating").length}
              </p>
            </div>
            <div className="bg-slate-900/90 border border-white/10 rounded-lg px-4 py-2">
              <p className="text-xs text-white/60">Regions</p>
              <p className="text-lg font-bold text-cyan-400">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
