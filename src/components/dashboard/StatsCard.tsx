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
    <div className="modern-card hover-lift group relative overflow-hidden rounded-xl p-6">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold data-text-muted uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold data-text mt-2 group-hover:scale-105 transition-transform duration-300">
              {value}
            </p>
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              {icon}
            </div>
          </div>
        </div>
        
        {trend && trend.value !== 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div
              className={`flex items-center text-sm font-semibold ${
                trend.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                trend.isPositive
                  ? 'bg-emerald-100 dark:bg-emerald-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
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
            <span className="text-xs data-text-muted font-medium">
              vs last period
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
