'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Search, Check, Plus, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import requestsJson from "../../../public/requests.json";

type Request = typeof requestsJson[0];

const AREA_COLORS: Record<string, string> = {
  "Withered Wastelands": "bg-amber-100 text-amber-800 border-amber-200",
  "Bleak Beach":         "bg-blue-100 text-blue-800 border-blue-200",
  "Rocky Ridges":        "bg-stone-100 text-stone-800 border-stone-200",
  "Sparkling Skylands":  "bg-sky-100 text-sky-800 border-sky-200",
  "All Areas":           "bg-gray-100 text-gray-700 border-gray-200",
};

const REWARD_ICONS: Record<string, string> = {
  move:    "⚡",
  unlock:  "🔓",
  recipe:  "📖",
  comfort: "💛",
  story:   "⭐",
  item:    "🎁",
};

const AREAS = ["All", "Withered Wastelands", "Bleak Beach", "Rocky Ridges", "Sparkling Skylands"];

export function RequestsPage() {
  const { setCurrentPage, completedRequests = [], inProgressRequests = [], toggleCompletedRequest, toggleInProgressRequest } = useAppStore() as any;
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = requestsJson.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchArea = areaFilter === "All" || r.area === areaFilter || r.area === "All Areas";
    const isCompleted = completedRequests.includes(r.id);
    const isInProgress = inProgressRequests.includes(r.id);
    if (statusFilter === "todo") return matchSearch && matchArea && !isCompleted && !isInProgress;
    if (statusFilter === "in-progress") return matchSearch && matchArea && isInProgress && !isCompleted;
    if (statusFilter === "done") return matchSearch && matchArea && isCompleted;
    return matchSearch && matchArea;
  });

  const totalCompleted = completedRequests.length;
  const totalInProgress = inProgressRequests.filter((id: string) => !completedRequests.includes(id)).length;
  const totalTodo = requestsJson.length - totalCompleted - totalInProgress;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-yellow-500 to-orange-500">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Requests</h1>
          <div className="w-11" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "To Do",       count: totalTodo,       filter: "todo"        as const },
            { label: "In Progress", count: totalInProgress, filter: "in-progress" as const },
            { label: "Completed",   count: totalCompleted,  filter: "done"        as const },
          ].map(({ label, count, filter }) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(statusFilter === filter ? "all" : filter)}
              className={`bg-white/20 ${statusFilter === filter ? "ring-2 ring-white" : ""} rounded-xl p-2 text-center active:scale-95 transition-all`}
            >
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-[10px] text-white/80">{label}</p>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(totalCompleted / requestsJson.length) * 100}%` }}
          />
        </div>
        <p className="text-white/60 text-[10px] text-right mt-1">{totalCompleted}/{requestsJson.length} completed</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden flex flex-col">
        {/* Search + Area Filter */}
        <div className="px-4 pt-4 pb-2 shrink-0 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Area filter only */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {AREAS.map(area => (
              <button
                key={area}
                onClick={() => setAreaFilter(area)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  areaFilter === area ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {area === "All" ? "All Areas" : area.split(" ").slice(-1)[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Requests list */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          <p className="text-xs text-gray-400 mb-1">{filtered.length} requests</p>
          {filtered.map((request) => {
            const isCompleted = completedRequests.includes(request.id);
            const isInProgress = !isCompleted && inProgressRequests.includes(request.id);
            const isExpanded = expandedId === request.id;

            return (
              <div
                key={request.id}
                className={`rounded-2xl border transition-all ${
                  isCompleted  ? "bg-green-50 border-green-200" :
                  isInProgress ? "bg-yellow-50 border-yellow-200" :
                                 "bg-white border-gray-100"
                }`}
              >
                {/* Collapsed row — tap to expand */}
                <button
                  className="w-full flex items-center gap-3 px-3 py-3 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : request.id)}
                >
                  {/* Important indicator removed */}
                  {false && (
                    <div
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {request.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${AREA_COLORS[request.area] || "bg-gray-100 text-gray-600"}`}>
                        {request.area}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {REWARD_ICONS[request.rewardType]} {request.reward}
                      </span>
                    </div>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-3">
                    {/* Task description */}
                    <p className="text-xs text-gray-600 leading-relaxed">{request.task}</p>

                    {/* Giver */}
                    {request.giver && request.giver !== "Unknown" && (
                      <p className="text-[11px] text-gray-400">👤 Given by: <span className="text-gray-600 font-medium">{request.giver}</span></p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => !isCompleted && toggleInProgressRequest(request.id)}
                        disabled={isCompleted}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isCompleted  ? "bg-gray-100 text-gray-300" :
                          isInProgress ? "bg-yellow-400 text-white" :
                                         "bg-gray-100 text-gray-600 active:scale-95"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {isInProgress ? "In Progress" : "Mark In Progress"}
                      </button>

                      <button
                        onClick={() => toggleCompletedRequest(request.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {isCompleted ? "Completed" : "Mark Complete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-sm">No requests match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
