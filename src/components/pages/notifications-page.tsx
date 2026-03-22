'use client'

import { useAppStore } from "@/lib/store";
import { notifications as initialNotifications } from "@/lib/pokemon-data";
import { ArrowLeft, Bell, Gift, Megaphone, Info, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const notificationIcons: Record<string, typeof Bell> = {
  event: Megaphone,
  reward: Gift,
  update: Info,
  info: Bell,
};

const notificationColors: Record<string, string> = {
  event: "bg-gradient-to-br from-purple-400 to-purple-500",
  reward: "bg-gradient-to-br from-yellow-400 to-yellow-500",
  update: "bg-gradient-to-br from-blue-400 to-blue-500",
  info: "bg-gradient-to-br from-gray-400 to-gray-500",
};

export function NotificationsPage() {
  const { setCurrentPage, markNotificationRead } = useAppStore();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    markNotificationRead(id);
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-500 to-blue-600">
      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setCurrentPage("home")}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-white/70">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <motion.button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 bg-white/20 rounded-full text-sm text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mark all read
            </motion.button>
          )}
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-full text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Bell className="w-16 h-16 mb-4" />
                <p className="font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </motion.div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type] || Bell;
                  const colorClass = notificationColors[notification.type] || notificationColors.info;
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 mt-3">
                        {!notification.read && (
                          <motion.button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Check className="w-3 h-3" />
                            Mark read
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => handleDelete(notification.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
