'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineGuard({ children }: { children: React.ReactNode }) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Check initial state
    setOffline(!navigator.onLine);

    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (offline) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No Internet Connection
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px] mx-auto">
            PokoPal needs an internet connection to work. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
