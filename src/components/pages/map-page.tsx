'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, ZoomIn, ZoomOut, MapPin, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function MapPage() {
  const { setCurrentPage } = useAppStore();
  const [zoom, setZoom] = useState(1);

  const locations = [
    { name: "Palette Town", x: "25%", y: "20%", type: "town" },
    { name: "Hot Spring Area", x: "60%", y: "35%", type: "special" },
    { name: "Withered Wasteland", x: "40%", y: "50%", type: "area" },
    { name: "Rocky Ridges", x: "75%", y: "60%", type: "biome" },
    { name: "Bleak Beach", x: "20%", y: "70%", type: "biome" },
    { name: "Main Island Hub", x: "50%", y: "45%", type: "main" },
  ];

  const locationColors: Record<string, string> = {
    town: "bg-blue-500",
    area: "bg-orange-500",
    biome: "bg-purple-500",
    special: "bg-pink-500",
    main: "bg-green-500",
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="pt-12 pb-3 px-4 bg-gray-800">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-lg font-bold text-white">Map</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-blue-800">
        {/* Map Image Placeholder */}
        <div 
          className="absolute inset-0"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={`h-${i}`} 
                className="absolute w-full h-px bg-white"
                style={{ top: `${(i + 1) * 5}%` }}
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={`v-${i}`} 
                className="absolute h-full w-px bg-white"
                style={{ left: `${(i + 1) * 6.67}%` }}
              />
            ))}
          </div>

          {/* Location Markers */}
          {locations.map((loc, index) => (
            <motion.button
              key={loc.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: loc.x, top: loc.y }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.2 }}
            >
              <div className={`w-8 h-8 rounded-full ${locationColors[loc.type]} shadow-lg flex items-center justify-center`}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-medium bg-black/70 text-white px-2 py-0.5 rounded">
                  {loc.name}
                </span>
              </div>
            </motion.button>
          ))}

          {/* Map Image Slot */}
          <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
            <div className="text-center text-white/40">
              <Compass className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">Map Image Slot</p>
              <p className="text-xs">Future marker overlays enabled</p>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <motion.button
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </motion.button>
          <motion.button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
