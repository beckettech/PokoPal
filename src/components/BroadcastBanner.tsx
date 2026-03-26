'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getApiUrl } from '@/lib/api-config';

export function BroadcastBanner() {
  const [message, setMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedUntil = localStorage.getItem('pokopia_broadcast_dismissed');
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      setDismissed(true);
      return;
    }

    fetch(getApiUrl("/api/admin/broadcast"))
      .then(r => r.json())
      .then(data => setMessage(data.message))
      .catch(() => {});
  }, []);

  if (!message || dismissed) return null;

  const handleDismiss = () => {
    const until = new Date(Date.now() + 24 * 3600000).toISOString();
    localStorage.setItem('pokopia_broadcast_dismissed', until);
    setDismissed(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
      <p className="text-xs font-medium flex-1 text-center">{message}</p>
      <button onClick={handleDismiss} className="ml-3 w-5 h-5 flex items-center justify-center rounded-full bg-white/20">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
