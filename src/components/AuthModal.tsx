'use client';

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { X, Mail, Lock, AtSign, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp, signIn } = useAppStore();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (tab === "signup") {
      if (!handle) { setError("Please choose a handle"); return; }
      if (password !== confirmPassword) { setError("Passwords don't match"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
      if (handle.length < 2 || /\s/.test(handle)) { setError("Handle must be at least 2 characters, no spaces"); return; }

      setLoading(true);
      const ok = await signUp(email, password, handle);
      setLoading(false);
      if (ok) { onClose(); resetForm(); }
      else { setError("Sign up failed. Email may already be in use."); }
    } else {
      setLoading(true);
      const ok = await signIn(email, password);
      setLoading(false);
      if (ok) { onClose(); resetForm(); }
      else { setError("Invalid email or password"); }
    }
  };

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirmPassword(""); setHandle(""); setError("");
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Welcome</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-4">
          <button
            onClick={() => { setTab("signup"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "signup" ? "bg-gradient-to-r from-red-500 to-purple-500 text-white shadow" : "text-gray-600 dark:text-gray-300"}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "login" ? "bg-gradient-to-r from-red-500 to-purple-500 text-white shadow" : "text-gray-600 dark:text-gray-300"}`}
          >
            Log In
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl px-3 py-2 mb-3">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={`${inputClass} pl-10`} />
          </div>

          {/* Handle (signup only) */}
          {tab === "signup" && (
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={handle} onChange={e => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))} placeholder="Handle" className={`${inputClass} pl-10`} />
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={`${inputClass} pl-10 pr-10`} />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          {/* Confirm Password (signup only) */}
          {tab === "signup" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className={`${inputClass} pl-10`} />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-purple-500 text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 text-sm"
          >
            {loading ? "Please wait..." : tab === "signup" ? "Create Account" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
