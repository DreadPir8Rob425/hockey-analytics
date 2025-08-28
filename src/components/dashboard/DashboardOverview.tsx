'use client';

import InteractiveHockeyHeatMap from '../charts/InteractiveHockeyHeatMap';

const DashboardOverview = () => {

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4" style={{backgroundImage: 'linear-gradient(135deg, var(--deep-navy) 0%, var(--professional-blue) 100%)'}}>
          Hockey Analytics Overview
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{color: 'var(--steel-gray)'}}>
          Comprehensive insights and performance metrics from the latest hockey data
        </p>
      </div>


      {/* Interactive Shot Heat Map - Full Width */}
      <div className="modern-card rounded-xl p-8">
        <h3 className="text-xl font-bold data-text mb-6 flex items-center space-x-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'var(--gradient-accent)'}}>🗺️</span>
          <span>Interactive Shot Heat Map</span>
        </h3>
        <InteractiveHockeyHeatMap width={1000} height={600} />
      </div>

    </div>
  );
};

export default DashboardOverview;
