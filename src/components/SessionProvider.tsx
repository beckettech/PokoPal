'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const restoreSession = useAppStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return <>{children}</>;
}
