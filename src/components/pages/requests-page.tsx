'use client'

import { useAppStore } from "@/lib/store";
import { requests } from "@/lib/pokemon-data";
import { ArrowLeft, Clock, CheckCircle2, Circle, Gift, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function RequestsPage() {
  const { setCurrentPage } = useAppStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50";
      case "in_progress":
        return "border-yellow-500 bg-yellow-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Story":
        return "bg-red-100 text-red-700";
      case "Event":
        return "bg-purple-100 text-purple-700";
      case "Battle":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const availableRequests = requests.filter(r => r.status === "available");
  const inProgressRequests = requests.filter(r => r.status === "in_progress");
  const completedRequests = requests.filter(r => r.status === "completed");

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-yellow-500 to-yellow-600">
      {/* Header */}
      <div className="pt-12 pb-3 px-4">
        <div className="flex items-center justify-between mb-3">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Requests</h1>
          <div className="w-9" />
        </div>

        {/* Stats */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white/20 rounded-xl p-2 text-center">
            <p className="text-xl font-bold text-white">{availableRequests.length}</p>
            <p className="text-[10px] text-white/70">Available</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-xl p-2 text-center">
            <p className="text-xl font-bold text-white">{inProgressRequests.length}</p>
            <p className="text-[10px] text-white/70">In Progress</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-xl p-2 text-center">
            <p className="text-xl font-bold text-white">{completedRequests.length}</p>
            <p className="text-[10px] text-white/70">Completed</p>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto p-3 space-y-3">
          {/* In Progress Section */}
          {inProgressRequests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase mb-2">In Progress</h2>
              {inProgressRequests.map((request) => (
                <motion.div
                  key={request.id}
                  className={`rounded-xl p-3 border-2 ${getStatusColor(request.status)} mb-2`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(request.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-sm">{request.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryColor(request.category)}`}>
                          {request.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{request.description}</p>
                      <div className="mt-2">
                        <p className="text-[10px] text-gray-500">Rewards:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.rewards.map((reward, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                              {reward}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Available Section */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase mb-2">Available</h2>
            {availableRequests.map((request, index) => (
              <motion.div
                key={request.id}
                className={`rounded-xl p-3 border-2 ${getStatusColor(request.status)} mb-2`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(request.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-sm">{request.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryColor(request.category)}`}>
                        {request.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{request.description}</p>
                    <div className="mt-2">
                      <p className="text-[10px] text-gray-500">Unlocks:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.unlocks.map((unlock, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {unlock}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Completed Section */}
          {completedRequests.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase mb-2">Completed</h2>
              {completedRequests.map((request) => (
                <motion.div
                  key={request.id}
                  className={`rounded-xl p-3 border-2 ${getStatusColor(request.status)} mb-2 opacity-70`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 0.7, x: 0 }}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(request.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 text-sm line-through">{request.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${getCategoryColor(request.category)}`}>
                          {request.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{request.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
