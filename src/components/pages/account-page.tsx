'use client';

import { useAppStore } from "@/lib/store";
import { ArrowLeft, User, Crown, RefreshCw, Info, Moon, Sun, Mail, AtSign, LogOut, Lock, Eye, EyeOff, Bug, Shield } from "lucide-react";
import { useState, useRef } from "react";
import { ReportIssueModal } from "@/components/ReportIssueModal";

export function AccountPage() {
  const { setCurrentPage, user, setPremium, restorePurchases, darkMode, toggleDarkMode, handle, setHandle, signUp, signIn, signOut, isLoggedIn, isAdmin, godMode, setGodMode, adminForceAds, setAdminForceAds } = useAppStore();
  const [isRestoring, setIsRestoring] = useState(false);
  const [adminRevealed, setAdminRevealed] = useState(false);
  const tapCount = useRef(0);

  // Auth form state
  const [authTab, setAuthTab] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authHandle, setAuthHandle] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [editingHandle, setEditingHandle] = useState(false);
  const [handleDraft, setHandleDraft] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      restorePurchases();
      try {
        const { Purchases } = await import('@revenuecat/purchases-capacitor');
        const { customerInfo } = await Purchases.getCustomerInfo();
        const hasPro = customerInfo.activeSubscriptions.includes('pro');
        if (hasPro) setPremium(true);
      } catch (e) {
        console.log('RevenueCat not available');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const handleAuthSubmit = async () => {
    setAuthError("");
    if (!email || !password) { setAuthError("Please fill in all fields"); return; }

    if (authTab === "signup") {
      if (!authHandle) { setAuthError("Please choose a handle"); return; }
      if (password.length < 6) { setAuthError("Password must be at least 6 characters"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setAuthError("Please enter a valid email"); return; }
      setAuthLoading(true);
      const ok = await signUp(email, password, authHandle);
      setAuthLoading(false);
      if (ok) { setAuthError(""); setEmail(""); setPassword(""); setAuthHandle(""); }
      else setAuthError("Sign up failed. Please try again.");
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setAuthError("Please enter a valid email"); return; }
      setAuthLoading(true);
      const ok = await signIn(email, password);
      setAuthLoading(false);
      if (ok) { setAuthError(""); setEmail(""); setPassword(""); }
      else setAuthError("Invalid email or password");
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-600 to-slate-800 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Account</h1>
            <p className="text-xs text-white/70">Premium & purchases</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-4">
          
          {/* Dark Mode Toggle */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <span className="font-medium text-gray-900 dark:text-white text-sm">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-7 rounded-full transition-colors duration-200 ${darkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Report Issue */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <Bug className="w-5 h-5 text-red-500" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">Report an Issue</span>
          </button>

          {/* Account Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Account
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {isLoggedIn ? (
                <>
                  {/* Logged in info */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                    <span className="text-xs text-gray-800 dark:text-gray-200 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">@Handle</span>
                    {editingHandle ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">@</span>
                        <input
                          type="text"
                          value={handleDraft}
                          onChange={(e) => setHandleDraft(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                          className="px-2 py-1 bg-white dark:bg-gray-800 rounded-lg text-xs text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 w-24"
                          autoFocus
                        />
                        <button onClick={() => { setHandle(handleDraft); setEditingHandle(false); }} className="text-xs text-purple-600 font-medium">Save</button>
                        <button onClick={() => setEditingHandle(false)} className="text-xs text-gray-400">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setHandleDraft(handle); setEditingHandle(true); }} className="text-xs text-gray-800 dark:text-gray-200 font-medium hover:text-purple-600 transition-colors">
                        @{handle}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Premium Status</span>
                    {user.isPremium ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <Crown className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Free</span>
                    )}
                  </div>
                  <button
                    onClick={signOut}
                    className="w-full py-2.5 mt-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Auth form */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Create an account to post islands and chat</p>
                  
                  {/* Tabs */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                    <button
                      onClick={() => { setAuthTab("signup"); setAuthError(""); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${authTab === "signup" ? "bg-gradient-to-r from-red-500 to-purple-500 text-white shadow" : "text-gray-600 dark:text-gray-300"}`}
                    >
                      Create Account
                    </button>
                    <button
                      onClick={() => { setAuthTab("login"); setAuthError(""); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${authTab === "login" ? "bg-gradient-to-r from-red-500 to-purple-500 text-white shadow" : "text-gray-600 dark:text-gray-300"}`}
                    >
                      Sign In
                    </button>
                  </div>

                  {authError && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2">
                      <p className="text-[11px] text-red-600 dark:text-red-400">{authError}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={`${inputClass} pl-10`} />
                    </div>
                    {authTab === "signup" && (
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={authHandle} onChange={e => setAuthHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))} placeholder="@handle" className={`${inputClass} pl-10`} />
                      </div>
                    )}
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={`${inputClass} pl-10 pr-10`} />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    <button
                      onClick={handleAuthSubmit}
                      disabled={authLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-red-500 to-purple-500 text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 text-sm"
                    >
                      {authLoading ? "Please wait..." : authTab === "signup" ? "Create Account" : "Sign In"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Premium Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl overflow-hidden border border-amber-200 dark:border-amber-700">
            <div className="px-4 py-3 border-b border-amber-100 dark:border-amber-700/50">
              <h2 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {user.isPremium ? (
                <div className="text-center py-4">
                  <Crown className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-amber-900 dark:text-amber-300">Premium Active</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Thank you for your support!</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-amber-800 dark:text-amber-300">Remove all ads and support development!</p>
                  <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <li>✓ No banner ads</li>
                    <li>✓ No interstitial ads</li>
                    <li>✓ Support future updates</li>
                  </ul>
                  <button
                    onClick={() => setPremium(true)}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-xl active:scale-95 transition-transform"
                  >
                    Remove Ads - $2.99
                  </button>
                </>
              )}
              <button
                onClick={handleRestorePurchases}
                disabled={isRestoring}
                className="w-full py-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
                {isRestoring ? 'Restoring...' : 'Restore Purchases'}
              </button>
            </div>
          </div>

          {/* About */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4" />
                About
              </h2>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
                <span
                  className="text-xs text-gray-400 dark:text-gray-500 cursor-pointer select-none"
                  onClick={() => {
                    tapCount.current++;
                    if (tapCount.current >= 5 && isAdmin && !adminRevealed) {
                      setAdminRevealed(true);
                      tapCount.current = 0;
                    }
                    setTimeout(() => { if (tapCount.current < 5) tapCount.current = 0; }, 2000);
                  }}
                >
                  Pokopia Guide v1.0.0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Developer</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">BEK Tech</span>
              </div>
            </div>
          </div>

          {/* Hidden Admin Section */}
          {adminRevealed && isAdmin && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl overflow-hidden border border-purple-200 dark:border-purple-700">
              <div className="px-4 py-3 border-b border-purple-100 dark:border-purple-700/50">
                <h2 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Settings
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {/* Ad Control */}
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Ad Override (your session only)</p>
                  <div className="flex gap-2">
                    {(["default", "show", "hide"] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAdminForceAds(opt)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          adminForceAds === opt
                            ? 'bg-purple-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {opt === 'default' ? 'Default' : opt === 'show' ? 'Force Show' : 'Force Hide'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* God Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">God Mode</p>
                    <p className="text-[10px] text-gray-500">Floating admin toolbar</p>
                  </div>
                  <button
                    onClick={() => setGodMode(!godMode)}
                    className={`w-12 h-7 rounded-full transition-colors ${godMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${godMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>
      </div>
      <ReportIssueModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} />
    </div>
  );
}
