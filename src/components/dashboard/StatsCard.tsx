interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => {
  return (
    <div className="ice-card hover-lift group relative overflow-hidden rounded-xl p-6">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide" style={{color: 'var(--steel-gray)'}}>
              {title}
            </p>
            <p className="text-3xl font-bold mt-2 group-hover:scale-105 transition-transform duration-300" style={{color: 'var(--deep-navy)'}}>
              {value}
            </p>
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300" style={{background: 'var(--gradient-navy)'}}>
              {icon}
            </div>
          </div>
        </div>
        
        {trend && trend.value !== 0 && (
          <div className="flex items-center justify-between pt-4 border-t" style={{borderColor: 'rgba(182, 219, 255, 0.3)'}}>
            <div
              className="flex items-center text-sm font-semibold"
              style={{
                color: trend.isPositive ? '#2f855a' : 'var(--hockey-red)'
              }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                style={{
                  backgroundColor: trend.isPositive ? '#f0fff4' : '#fff5f5'
                }}
              >
                <svg
                  className={`w-3 h-3 ${
                    trend.isPositive ? 'rotate-0' : 'rotate-180'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {Math.abs(trend.value)}%
            </div>
            <span className="text-xs font-medium" style={{color: 'var(--steel-gray)'}}>
              vs last period
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
