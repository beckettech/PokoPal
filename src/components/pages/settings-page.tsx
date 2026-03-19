'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, User, Bell, Moon, Volume2, Globe, Shield, HelpCircle, LogOut, ChevronRight, Smartphone, Cloud, Info, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function SettingsPage() {
  const { setCurrentPage, isOnline, toggleOnline, coins } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const settingSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", value: "Trainer Red", action: () => {} },
        { icon: Cloud, label: "Cloud Sync", value: isOnline ? "Connected" : "Offline", toggle: toggleOnline },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", toggle: () => setNotifications(!notifications), value: notifications },
        { icon: Moon, label: "Dark Mode", toggle: () => setDarkMode(!darkMode), value: darkMode },
        { icon: Volume2, label: "Sound Effects", toggle: () => setSound(!sound), value: sound },
        { icon: Smartphone, label: "Haptic Feedback", toggle: () => setHaptics(!haptics), value: haptics },
      ]
    },
    {
      title: "Game",
      items: [
        { icon: Globe, label: "Language", value: "English", action: () => {} },
        { icon: Shield, label: "Privacy Settings", action: () => {} },
      ]
    },
    {
      title: "About",
      items: [
        { icon: Info, label: "About Pokopia", value: "v2.1.0", action: () => {} },
        { icon: HelpCircle, label: "Help & Support", action: () => {} },
        { icon: Heart, label: "Rate Us", action: () => {} },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-600 to-gray-700">
      {/* Header */}
      <div className="pt-12 pb-4 px-4">
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* User Card */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">R</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Trainer Red</h2>
                <p className="text-sm text-gray-500">{coins.toLocaleString()} PokéCoins</p>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <div key={section.title} className="border-b border-gray-100">
              <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase">
                {section.title}
              </h3>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                    onClick={item.action || item.toggle}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    
                    {item.toggle ? (
                      <motion.button
                        className={`w-12 h-7 rounded-full p-1 ${
                          item.value ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white shadow"
                          animate={{ x: item.value ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="text-sm text-gray-400">{item.value}</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <div className="p-4">
            <motion.button
              className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-medium flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, backgroundColor: '#fef2f2' }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </motion.button>
          </div>

          {/* Version Info */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">Pokopia Guide v2.1.0</p>
            <p className="text-xs text-gray-300 mt-1">Made with ❤️ for Trainers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
