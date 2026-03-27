'use client'

import { useEffect } from 'react'

export function AdBanner() {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || []
      (window as any).adsbygoogle.push({})
    } catch {}
  }, [])

  return (
    <div className="w-full flex justify-center py-1 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '50px' }}
        data-ad-client="ca-pub-8733903111878090"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
