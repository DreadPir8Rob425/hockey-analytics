'use client';

import { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import PlayerPerformanceChart from '../charts/PlayerPerformanceChart';
import TeamComparisonChart from '../charts/TeamComparisonChart';
import GameTrendsChart from '../charts/GameTrendsChart';

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
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Players Performance
          </h3>
          <PlayerPerformanceChart />
        </div>

        {/* Team Comparison Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Performance Comparison
          </h3>
          <TeamComparisonChart />
        </div>
      </div>

      {/* Game Trends Chart - Full Width */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Seasonal Game Trends
        </h3>
        <GameTrendsChart />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors">
            Import Game Data
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors">
            Generate Report
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors">
            Export Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
