'use client';

import { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import PlayerPerformanceChart from '../charts/PlayerPerformanceChart';
import TeamComparisonChart from '../charts/TeamComparisonChart';
import GameTrendsChart from '../charts/GameTrendsChart';
import InteractiveHockeyHeatMap from '../charts/InteractiveHockeyHeatMap';

interface DashboardStats {
  totalGames: number;
  totalPlayers: number;
  totalTeams: number;
  avgGoalsPerGame: number;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalPlayers: 0,
    totalTeams: 0,
    avgGoalsPerGame: 0,
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchStats = () => {
      setStats({
        totalGames: 1247,
        totalPlayers: 890,
        totalTeams: 32,
        avgGoalsPerGame: 3.2,
      });
    };

    fetchStats();
  }, []);

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard
          title="Total Games"
          value={stats.totalGames.toLocaleString()}
          icon="🏒"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Players"
          value={stats.totalPlayers.toLocaleString()}
          icon="👥"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Teams"
          value={stats.totalTeams.toString()}
          icon="🏆"
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="Avg Goals/Game"
          value={stats.avgGoalsPerGame.toFixed(1)}
          icon="⚽"
          trend={{ value: 2.3, isPositive: false }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player Performance Chart */}
        <div className="modern-card rounded-xl p-8">
          <h3 className="text-xl font-bold data-text mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'var(--gradient-secondary)'}}>🎯</span>
            <span>Top Players Performance</span>
          </h3>
          <PlayerPerformanceChart />
        </div>

        {/* Team Comparison Chart */}
        <div className="modern-card rounded-xl p-8">
          <h3 className="text-xl font-bold data-text mb-6 flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'linear-gradient(135deg, var(--deep-navy) 0%, var(--steel-gray) 100%)'}}>📈</span>
            <span>Team Performance Comparison</span>
          </h3>
          <TeamComparisonChart />
        </div>
      </div>

      {/* Game Trends Chart - Full Width */}
      <div className="modern-card rounded-xl p-8">
        <h3 className="text-xl font-bold data-text mb-6 flex items-center space-x-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'var(--gradient-primary)'}}>📉</span>
          <span>Seasonal Game Trends</span>
        </h3>
        <GameTrendsChart />
      </div>

      {/* Interactive Shot Heat Map - Full Width */}
      <div className="modern-card rounded-xl p-8">
        <h3 className="text-xl font-bold data-text mb-6 flex items-center space-x-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'var(--gradient-accent)'}}>🗺️</span>
          <span>Interactive Shot Heat Map</span>
        </h3>
        <InteractiveHockeyHeatMap width={1000} height={600} />
      </div>

      {/* Quick Actions */}
      <div className="modern-card rounded-xl p-8">
        <h3 className="text-xl font-bold data-text mb-6 flex items-center space-x-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'}}>⚡</span>
          <span>Quick Actions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="group relative overflow-hidden text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" style={{background: 'var(--gradient-secondary)'}}>
            <div className="relative z-10 flex items-center space-x-2">
              <span>📈</span>
              <span>Import Game Data</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button className="group relative overflow-hidden text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" style={{background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100)'}}>
            <div className="relative z-10 flex items-center space-x-2">
              <span>📄</span>
              <span>Generate Report</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button className="group relative overflow-hidden text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" style={{background: 'var(--gradient-accent)'}}>
            <div className="relative z-10 flex items-center space-x-2">
              <span>📤</span>
              <span>Export Analytics</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
