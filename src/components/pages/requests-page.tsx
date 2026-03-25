'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Search, Check, Plus, Loader2, Clock, Sparkles, Swords, BookOpen, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import requestsJson from "../../../public/requests.json";

type Request = typeof requestsJson[0];

const AREA_COLORS: Record<string, string> = {
  "Withered Wastelands": "bg-amber-100 text-amber-800 border-amber-200",
  "Bleak Beach": "bg-blue-100 text-blue-800 border-blue-200",
  "Rocky Ridges": "bg-stone-100 text-stone-800 border-stone-200",
  "Sparkling Skylands": "bg-sky-100 text-sky-800 border-sky-200",
};

const REWARD_ICONS: Record<string, { icon: string; label: string; color: string }> = {
  move:    { icon: "⚡", label: "Move",    color: "bg-yellow-100 text-yellow-800" },
  unlock:  { icon: "🔓", label: "Unlock",  color: "bg-green-100 text-green-800" },
  recipe:  { icon: "📖", label: "Recipe",  color: "bg-orange-100 text-orange-800" },
  comfort: { icon: "💛", label: "Comfort", color: "bg-pink-100 text-pink-800" },
  story:   { icon: "⭐", label: "Story",   color: "bg-purple-100 text-purple-800" },
  item:    { icon: "🎁", label: "Item",    color: "bg-teal-100 text-teal-800" },
};

const AREAS = ["All", "Withered Wastelands", "Bleak Beach", "Rocky Ridges", "Sparkling Skylands"];
const REWARD_FILTERS = ["All", "move", "unlock", "recipe", "comfort", "story", "item"];

export function RequestsPage() {
  const { setCurrentPage, completedRequests = [], inProgressRequests = [], toggleCompletedRequest, toggleInProgressRequest } = useAppStore() as any;
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  const [rewardFilter, setRewardFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");

  const filtered = requestsJson.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.task.toLowerCase().includes(search.toLowerCase());
    const matchArea = areaFilter === "All" || r.area === areaFilter;
    const matchReward = rewardFilter === "All" || r.rewardType === rewardFilter;
    const isCompleted = completedRequests.includes(r.id);
    const isInProgress = inProgressRequests.includes(r.id);
    if (statusFilter === "todo") return matchSearch && matchArea && matchReward && !isCompleted && !isInProgress;
    if (statusFilter === "in-progress") return matchSearch && matchArea && matchReward && isInProgress && !isCompleted;
    if (statusFilter === "done") return matchSearch && matchArea && matchReward && isCompleted;
    return matchSearch && matchArea && matchReward;
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
            { label: "To Do", count: totalTodo, filter: "todo" as const, color: "bg-white/20" },
            { label: "In Progress", count: totalInProgress, filter: "in-progress" as const, color: "bg-white/30" },
            { label: "Completed", count: totalCompleted, filter: "done" as const, color: "bg-white/20" },
          ].map(({ label, count, filter, color }) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(statusFilter === filter ? "all" : filter)}
              className={`${color} ${statusFilter === filter ? "ring-2 ring-white" : ""} rounded-xl p-2 text-center active:scale-95 transition-all`}
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
        {/* Search + Filters */}
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

          {/* Area filter */}
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

          {/* Reward filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {REWARD_FILTERS.map(r => {
              const info = r === "All" ? null : REWARD_ICONS[r];
              return (
                <button
                  key={r}
                  onClick={() => setRewardFilter(r)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    rewardFilter === r ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {info ? `${info.icon} ${info.label}` : "All Rewards"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Requests list */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          <p className="text-xs text-gray-400 mb-2">{filtered.length} requests</p>
          {filtered.map((request) => {
            const isCompleted = completedRequests.includes(request.id);
            const isInProgress = !isCompleted && inProgressRequests.includes(request.id);
            const rewardInfo = REWARD_ICONS[request.rewardType];

            return (
              <div
                key={request.id}
                className={`rounded-2xl border p-3 transition-all ${
                  isCompleted
                    ? "bg-green-50 border-green-200"
                    : isInProgress
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status buttons */}
                  <div className="flex flex-col gap-1.5 pt-0.5 shrink-0">
                    {/* In-progress button */}
                    <button
                      onClick={() => !isCompleted && toggleInProgressRequest(request.id)}
                      disabled={isCompleted}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-gray-100 text-gray-300"
                          : isInProgress
                          ? "bg-yellow-400 text-white"
                          : "bg-gray-100 text-gray-400 active:scale-90"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </button>

                    {/* Complete button */}
                    <button
                      onClick={() => toggleCompletedRequest(request.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <h3 className={`font-bold text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
                        {request.name}
                      </h3>
                    </div>

                    {/* Task description */}
                    <p className={`text-xs leading-relaxed mb-2 ${isCompleted ? "text-gray-400" : "text-gray-600"}`}>
                      {request.task}
                    </p>

                    {/* Tags row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Area badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${AREA_COLORS[request.area] || "bg-gray-100 text-gray-600"}`}>
                        {request.area}
                      </span>

                      {/* Reward badge */}
                      {rewardInfo && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${rewardInfo.color}`}>
                          {rewardInfo.icon} {request.reward}
                        </span>
                      )}

                      {/* Giver */}
                      {request.giver && request.giver !== "Unknown" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          👤 {request.giver}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
