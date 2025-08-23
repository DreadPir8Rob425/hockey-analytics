import React, { useState } from 'react';
import { getStatDefinition, StatDefinition } from '@/utils/hockeyStatsGlossary';

interface StatTooltipProps {
  statKey: string;
  value?: string | number;
  children: React.ReactNode;
  className?: string;
}

export const StatTooltip: React.FC<StatTooltipProps> = ({ 
  statKey, 
  value, 
  children, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const statDef = getStatDefinition(statKey);

  if (!statDef) {
    return <>{children}</>;
  }

  const getValueInterpretation = (val: string | number, stat: StatDefinition): string => {
    if (val === undefined || val === null) return '';
    
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    
    // Specific interpretation logic for different stats
    switch (statKey.toLowerCase()) {
      case 'corsi':
      case 'fenwick':
        if (numVal > 55) return stat.interpretation.high;
        if (numVal < 45) return stat.interpretation.low;
        return stat.interpretation.average;
        
      case 'pdo':
        if (numVal > 102) return stat.interpretation.high;
        if (numVal < 98) return stat.interpretation.low;
        return stat.interpretation.average;
        
      case 'shooting_percentage':
        if (numVal > 12) return stat.interpretation.high;
        if (numVal < 8) return stat.interpretation.low;
        return stat.interpretation.average;
        
      case 'save_percentage':
        if (numVal > 0.92) return stat.interpretation.high;
        if (numVal < 0.90) return stat.interpretation.low;
        return stat.interpretation.average;
        
      default:
        return stat.interpretation.average;
    }
  };

  const getCategoryColor = (category: StatDefinition['category']): string => {
    switch (category) {
      case 'basic': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      case 'situational': return 'bg-green-500';
      case 'goaltending': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: StatDefinition['category']): string => {
    switch (category) {
      case 'basic': return '📊';
      case 'advanced': return '🧮';
      case 'situational': return '⚡';
      case 'goaltending': return '🥅';
      default: return '📈';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`cursor-help border-b border-dashed border-gray-400 hover:border-gray-600 transition-colors ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-96 p-4 bg-white rounded-xl shadow-2xl border-2 border-gray-200 -top-2 left-full ml-4 transform -translate-y-1/2">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-200">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getCategoryColor(statDef.category)}`}>
              <span>{getCategoryIcon(statDef.category)}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{statDef.name}</h3>
              <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
                {statDef.shortName} • {statDef.category}
              </p>
            </div>
          </div>

          {/* Value and Interpretation */}
          {value !== undefined && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">Current Value:</span>
                <span className="text-xl font-bold text-gray-900">{value}</span>
              </div>
              <div className="text-sm text-gray-700 italic">
                {getValueInterpretation(value, statDef)}
              </div>
            </div>
          )}

          {/* Definition */}
          <div className="mb-3">
            <h4 className="font-semibold text-gray-900 mb-2">Definition</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{statDef.definition}</p>
          </div>

          {/* Explanation */}
          <div className="mb-3">
            <h4 className="font-semibold text-gray-900 mb-2">Why It Matters</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{statDef.explanation}</p>
          </div>

          {/* Calculation */}
          {statDef.calculation && (
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 mb-2">Calculation</h4>
              <div className="bg-gray-100 p-2 rounded font-mono text-sm text-gray-800">
                {statDef.calculation}
              </div>
            </div>
          )}

          {/* Good Range */}
          {statDef.goodRange && (
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 mb-2">What's Good?</h4>
              <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">
                {statDef.goodRange}
              </p>
            </div>
          )}

          {/* Examples */}
          {statDef.examples && statDef.examples.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {statDef.examples.map((example, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Stats */}
          {statDef.relatedStats && statDef.relatedStats.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Related Statistics</h4>
              <div className="flex flex-wrap gap-2">
                {statDef.relatedStats.map((relatedStat, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                  >
                    {relatedStat.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tooltip arrow */}
          <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2">
            <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
            <div className="absolute top-0 left-0 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-200 transform translate-x-[-2px]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized component for stat values with tooltips
interface StatValueWithTooltipProps {
  statKey: string;
  value: string | number;
  label?: string;
  className?: string;
  valueClassName?: string;
}

export const StatValueWithTooltip: React.FC<StatValueWithTooltipProps> = ({
  statKey,
  value,
  label,
  className = '',
  valueClassName = ''
}) => {
  return (
    <div className={`flex justify-between items-center py-3 ${className}`}>
      <StatTooltip statKey={statKey} value={value}>
        <span className="font-bold text-gray-700">{label || getStatDefinition(statKey)?.name || statKey}</span>
      </StatTooltip>
      <span className={`font-black text-xl ${valueClassName}`}>{value}</span>
    </div>
  );
};

// Quick reference component for showing stat categories
export const StatCategoryLegend: React.FC = () => {
  const categories = [
    { key: 'basic', name: 'Basic Stats', icon: '📊', color: 'bg-blue-500' },
    { key: 'advanced', name: 'Advanced', icon: '🧮', color: 'bg-purple-500' },
    { key: 'situational', name: 'Situational', icon: '⚡', color: 'bg-green-500' },
    { key: 'goaltending', name: 'Goaltending', icon: '🥅', color: 'bg-orange-500' }
  ];

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border">
      <span className="text-sm font-semibold text-gray-600 mr-2">Stat Categories:</span>
      {categories.map(category => (
        <div key={category.key} className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${category.color}`}>
            {category.icon}
          </div>
          <span className="text-sm font-medium text-gray-700">{category.name}</span>
        </div>
      ))}
    </div>
  );
};
