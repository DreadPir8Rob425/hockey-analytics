'use client';

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const mockTrendsData = [
  { month: 'Oct', goalsPerGame: 3.1, assistsPerGame: 4.2, totalGames: 124 },
  { month: 'Nov', goalsPerGame: 3.3, assistsPerGame: 4.5, totalGames: 156 },
  { month: 'Dec', goalsPerGame: 3.2, assistsPerGame: 4.3, totalGames: 142 },
  { month: 'Jan', goalsPerGame: 3.4, assistsPerGame: 4.6, totalGames: 168 },
  { month: 'Feb', goalsPerGame: 3.0, assistsPerGame: 4.1, totalGames: 134 },
  { month: 'Mar', goalsPerGame: 3.5, assistsPerGame: 4.8, totalGames: 175 },
  { month: 'Apr', goalsPerGame: 3.3, assistsPerGame: 4.4, totalGames: 158 },
];

const GameTrendsChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mockTrendsData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value, name) => [
              typeof value === 'number' ? value.toFixed(1) : value,
              name === 'goalsPerGame' ? 'Goals per Game' :
              name === 'assistsPerGame' ? 'Assists per Game' :
              name === 'totalGames' ? 'Total Games' : name
            ]}
          />
          <Area
            type="monotone"
            dataKey="goalsPerGame"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="assistsPerGame"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
          />
          {/* Line removed - using stacked areas only */}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GameTrendsChart;
