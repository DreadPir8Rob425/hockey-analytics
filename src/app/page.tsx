import { Suspense } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import Navigation from '@/components/layout/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Hockey Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive analytics and insights for hockey performance data
          </p>
        </div>
        
        <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>}>
          <DashboardOverview />
        </Suspense>
      </main>
    </div>
  );
}
