import { Suspense } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import Navigation from '@/components/layout/Navigation';

export default function SandboxPage() {
  return (
    <div className="min-h-screen gradient-hero">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full shadow-ice flex items-center justify-center" style={{background: 'var(--gradient-navy)'}}>
              <span className="text-white font-bold text-xl">⚡</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(135deg, var(--deep-navy) 0%, var(--professional-blue) 100%)'}}>
              Analytics Sandbox
            </h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--steel-gray)'}}>
            Experimental features and interactive data exploration tools for advanced hockey analytics
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full border" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
            <span className="text-sm">🧪</span>
            <span className="text-sm font-medium" style={{color: 'var(--professional-blue)'}}>
              Interactive charts • Data playground • Advanced visualizations
            </span>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4" style={{borderColor: 'var(--ice-blue-dark)', borderTopColor: 'var(--professional-blue)'}}></div>
              <div className="absolute inset-0 rounded-full opacity-20 animate-pulse" style={{background: 'var(--gradient-secondary)'}}></div>
            </div>
            <p className="text-lg font-medium" style={{color: 'var(--deep-navy)'}}>Loading sandbox...</p>
            <p className="text-sm" style={{color: 'var(--steel-gray)'}}>Preparing your analytics playground</p>
          </div>
        }>
          <DashboardOverview />
        </Suspense>
      </main>
    </div>
  );
}
