'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Games page since it's now the default
    router.replace('/games');
  }, [router]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 mx-auto" style={{borderColor: 'var(--ice-blue-dark)', borderTopColor: 'var(--professional-blue)'}}></div>
          <div className="absolute inset-0 rounded-full opacity-20 animate-pulse" style={{background: 'var(--gradient-secondary)'}}></div>
        </div>
        <p className="text-lg font-medium" style={{color: 'var(--deep-navy)'}}>Redirecting to Games...</p>
      </div>
    </div>
  );
}
