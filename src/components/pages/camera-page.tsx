'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Camera, ImageIcon, Zap, RotateCcw, Focus, Aperture } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function CameraPage() {
  const { setCurrentPage } = useAppStore();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured(true);
    setTimeout(() => setCaptured(false), 200);
  };

  return (
    <div className="h-full flex flex-col bg-black relative overflow-hidden">
      {/* Camera Viewfinder */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
        </div>

        {/* Pokemon Silhouette Placeholder */}
        <motion.div
          className="relative"
          animate={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center border-2 border-dashed border-white/30">
            <motion.div
              className="text-6xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ⚡
            </motion.div>
          </div>
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white text-sm font-medium">Pikachu detected!</p>
          </motion.div>
        </motion.div>

        {/* AR Elements */}
        <motion.div
          className="absolute top-32 right-8 bg-white/90 rounded-lg p-2 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-800">AR Active</span>
          </div>
        </motion.div>
      </div>

      {/* Flash Effect */}
      {captured && (
        <motion.div
          className="absolute inset-0 bg-white z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Header */}
      <div className="relative z-10 pt-12 pb-4 px-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          
          <h1 className="text-xl font-bold text-white">AR Camera</h1>
          
          <motion.button
            onClick={() => setFlashEnabled(!flashEnabled)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              flashEnabled ? 'bg-yellow-400' : 'bg-white/20'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Zap className={`w-5 h-5 ${flashEnabled ? 'text-yellow-900' : 'text-white'}`} />
          </motion.button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {[1, 1.5, 2].map((z) => (
          <motion.button
            key={z}
            onClick={() => setZoom(z)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
              zoom === z 
                ? 'bg-white text-gray-900' 
                : 'bg-white/20 text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {z}x
          </motion.button>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 mt-auto pb-8">
        {/* Focus Indicator */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Focus className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Tap to focus</span>
          </motion.div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-around px-8">
          {/* Gallery */}
          <motion.button
            className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ImageIcon className="w-6 h-6 text-white" />
          </motion.button>

          {/* Capture Button */}
          <motion.button
            onClick={handleCapture}
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
              <motion.div 
                className="w-16 h-16 rounded-full bg-white"
                whileHover={{ scale: 0.95 }}
              />
            </div>
          </motion.button>

          {/* Switch Camera */}
          <motion.button
            onClick={() => setFrontCamera(!frontCamera)}
            className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-6 mt-6">
          {['Photo', 'Video', 'AR'].map((mode) => (
            <motion.button
              key={mode}
              className={`text-sm font-medium ${
                mode === 'AR' ? 'text-white' : 'text-white/50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mode}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
