'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const mockTeamData = [
  { metric: 'Goals For', teamA: 285, teamB: 268, teamC: 245 },
  { metric: 'Goals Against', teamA: 220, teamB: 235, teamC: 258 },
  { metric: 'Power Play %', teamA: 22.5, teamB: 19.8, teamC: 17.2 },
  { metric: 'Penalty Kill %', teamA: 84.2, teamB: 82.1, teamC: 79.5 },
  { metric: 'Shots For', teamA: 32.1, teamB: 30.5, teamC: 29.2 },
  { metric: 'Faceoff Win %', teamA: 52.3, teamB: 48.7, teamC: 46.1 },
];

const TeamComparisonChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={mockTeamData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" fontSize={10} />
          <PolarRadiusAxis angle={0} domain={[0, 100]} tickCount={5} fontSize={8} />
          <Radar
            name="Edmonton Oilers"
            dataKey="teamA"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Toronto Maple Leafs"
            dataKey="teamB"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Colorado Avalanche"
            dataKey="teamC"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamComparisonChart;
