'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockPlayerData = [
  { name: 'Connor McDavid', goals: 42, assists: 58, points: 100 },
  { name: 'Leon Draisaitl', goals: 38, assists: 52, points: 90 },
  { name: 'Nathan MacKinnon', goals: 35, assists: 48, points: 83 },
  { name: 'David Pastrnak', goals: 45, assists: 35, points: 80 },
  { name: 'Auston Matthews', goals: 41, assists: 36, points: 77 },
  { name: 'Mikko Rantanen', goals: 32, assists: 44, points: 76 },
];

const PlayerPerformanceChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockPlayerData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Bar dataKey="goals" fill="#3b82f6" name="Goals" />
          <Bar dataKey="assists" fill="#10b981" name="Assists" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayerPerformanceChart;
