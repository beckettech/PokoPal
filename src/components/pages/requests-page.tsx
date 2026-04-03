'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Search, Check, Plus, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import requestsJson from "../../../public/requests.json";

type Request = typeof requestsJson[0];

const AREA_COLORS: Record<string, string> = {
  "Withered Wastelands": "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  "Bleak Beach":         "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  "Rocky Ridges":        "bg-stone-100 dark:bg-stone-900/40 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700",
  "Sparkling Skylands":  "bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-700",
  "All Areas":           "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
};

const REWARD_ICONS: Record<string, string> = {
  move:    "⚡",
  unlock:  "🔓",
  recipe:  "📖",
  comfort: "💛",
  story:   "⭐",
  item:    "🎁",
};

const AREAS = ["Withered Wastelands", "Bleak Beach", "Rocky Ridges", "Sparkling Skylands"];

export function RequestsPage() {
  const { setCurrentPage, completedRequests = [], inProgressRequests = [], toggleCompletedRequest, toggleInProgressRequest } = useAppStore() as any;
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("Withered Wastelands");
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = requestsJson.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchArea = r.area === areaFilter || r.area === "All Areas";
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
    <div className="h-full flex flex-col bg-gradient-to-b from-yellow-500 to-orange-500 dark:from-yellow-500 dark:to-orange-600">
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
            className="h-full bg-white dark:bg-gray-800 rounded-full transition-all"
            style={{ width: `${(totalCompleted / requestsJson.length) * 100}%` }}
          />
        </div>
        <p className="text-white/60 text-[10px] text-right mt-1">{totalCompleted}/{requestsJson.length} completed</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-[2rem] overflow-hidden flex flex-col">
        {/* Search + Area Filter */}
        <div className="px-4 pt-4 pb-2 shrink-0 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Area filter only */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {AREAS.map(area => (
              <button
                key={area}
                onClick={() => setAreaFilter(area)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  areaFilter === area ? "bg-yellow-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {area.split(" ").slice(-1)[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Requests list */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{filtered.length} requests</p>
          {filtered.map((request) => {
            const isCompleted = completedRequests.includes(request.id);
            const isInProgress = !isCompleted && inProgressRequests.includes(request.id);
            const isExpanded = expandedId === request.id;

            return (
              <div
                key={request.id}
                className={`rounded-2xl border transition-all ${
                  isCompleted  ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700" :
                  isInProgress ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700" :
                                 "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                }`}
              >
                {/* Collapsed row — tap to expand */}
                <button
                  className="w-full flex items-center gap-3 px-3 py-3 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : request.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isCompleted ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"}`}>
                      {request.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${AREA_COLORS[request.area] || "bg-gray-100 dark:bg-gray-700 text-gray-600"}`}>
                        {request.area}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {REWARD_ICONS[request.rewardType]} {request.reward}
                      </span>
                    </div>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
                    {/* Task description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{request.task}</p>

                    {/* Required Items Preview */}
                    {request.requiredItems && request.requiredItems.length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-3 border border-amber-100 dark:border-amber-800">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-3">📦 Required Items</p>
                        <div className="flex gap-2 flex-wrap">
                          {request.requiredItems.map((item: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-xl border border-amber-200 dark:border-amber-700 shadow-sm flex items-center justify-center relative">
                                <img
                                  src={`/items/${item.slug}.png`}
                                  alt={item.name}
                                  className="w-11 h-11 object-contain"
                                  onError={e => {
                                    const el = e.target as HTMLImageElement;
                                    el.style.display = 'none';
                                    const ph = el.nextElementSibling;
                                    if (ph) ph.style.display = 'flex';
                                  }}
                                />
                                <span className="absolute inset-0 items-center justify-center text-lg hidden" style={{ display: 'none' }}>📦</span>
                                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                  {item.qty}
                                </span>
                              </div>
                              <span className="text-[9px] text-center text-amber-900 dark:text-amber-300 font-medium max-w-[56px] leading-tight">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Giver */}
                    {request.giver && request.giver !== "Unknown" && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">👤 Given by: <span className="text-gray-600 dark:text-gray-300 font-medium">{request.giver}</span></p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => !isCompleted && toggleInProgressRequest(request.id)}
                        disabled={isCompleted}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isCompleted  ? "bg-gray-100 dark:bg-gray-700 text-gray-300" :
                          isInProgress ? "bg-yellow-400 dark:bg-yellow-500 text-white" :
                                         "bg-gray-100 dark:bg-gray-700 text-gray-600 active:scale-95"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {isInProgress ? "In Progress" : "Mark In Progress"}
                      </button>

                      <button
                        onClick={() => toggleCompletedRequest(request.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          isCompleted ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600"
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
