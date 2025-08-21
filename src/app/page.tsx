import { Suspense } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import Navigation from '@/components/layout/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🏒</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hockey Analytics Dashboard
            </h1>
          </div>
          <p className="text-xl data-text-secondary max-w-3xl mx-auto">
            Comprehensive analytics and insights for hockey performance data with advanced statistical modeling
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
            <span className="text-sm">✨</span>
            <span className="text-sm font-medium text-blue-700">
              Real-time data • Advanced metrics • Interactive visualizations
            </span>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 animate-pulse"></div>
            </div>
            <p className="text-lg font-medium data-text-secondary">Loading dashboard...</p>
            <p className="text-sm data-text-muted">Preparing your analytics overview</p>
          </div>
        }>
          <DashboardOverview />
        </Suspense>
      </main>
    </div>
  );
}
