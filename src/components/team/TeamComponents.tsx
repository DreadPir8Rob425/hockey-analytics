import React from 'react';
import { getTeamColors, getTeamCSSVariables, isValidTeam } from '@/utils/teamColors';

interface BaseTeamProps {
  team: string;
  className?: string;
}

/**
 * Team Badge - Small circular or rounded rectangle with team colors
 */
interface TeamBadgeProps extends BaseTeamProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circle' | 'rounded' | 'pill';
  showText?: boolean;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({
  team,
  size = 'md',
  variant = 'rounded',
  showText = true,
  className = ''
}) => {
  const teamColors = getTeamColors(team);
  const cssVars = getTeamCSSVariables(team);
  
  const sizeClasses = {
    sm: showText ? 'w-12 h-6 text-xs' : 'w-6 h-6',
    md: showText ? 'w-16 h-8 text-sm' : 'w-8 h-8',
    lg: showText ? 'w-20 h-10 text-base' : 'w-10 h-10'
  };
  
  const variantClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    pill: 'rounded-full'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        flex items-center justify-center font-bold
        border-2 shadow-sm transition-all duration-200 hover:shadow-md
        ${className}
      `}
      style={{
        ...cssVars,
        backgroundColor: 'var(--team-primary)',
        color: 'var(--team-text-primary)',
        borderColor: 'var(--team-secondary)'
      } as React.CSSProperties}
    >
      {showText && <span className="font-bold">{team}</span>}
    </div>
  );
};

/**
 * Team Header - Full-width header with team colors and gradient
 */
interface TeamHeaderProps extends BaseTeamProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  team,
  title,
  subtitle,
  children,
  className = ''
}) => {
  const cssVars = getTeamCSSVariables(team);

  return (
    <div
      className={`
        w-full px-6 py-8 rounded-xl shadow-lg
        ${className}
      `}
      style={{
        ...cssVars,
        background: 'var(--team-gradient)',
        color: 'var(--team-text-primary)'
      } as React.CSSProperties}
    >
      <div className="flex items-center space-x-4">
        <TeamBadge team={team} size="lg" showText={false} />
        <div className="flex-1">
          {title && (
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--team-text-primary)' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg opacity-90" style={{ color: 'var(--team-text-primary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

/**
 * Team Card - Card component with team-themed styling
 */
interface TeamCardProps extends BaseTeamProps {
  title?: string;
  stats?: Array<{ label: string; value: string | number }>;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient';
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  title,
  stats,
  children,
  variant = 'primary',
  className = ''
}) => {
  const cssVars = getTeamCSSVariables(team);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--team-primary)',
          color: 'var(--team-text-primary)',
          borderColor: 'var(--team-secondary)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--team-secondary)',
          color: 'var(--team-text-secondary)',
          borderColor: 'var(--team-primary)'
        };
      case 'gradient':
        return {
          background: 'var(--team-gradient)',
          color: 'var(--team-text-primary)',
          borderColor: 'var(--team-secondary)'
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`
        p-6 rounded-xl border-2 shadow-lg transition-all duration-300
        hover:shadow-xl hover:scale-105
        ${className}
      `}
      style={{
        ...cssVars,
        ...getVariantStyles()
      } as React.CSSProperties}
    >
      {title && (
        <div className="flex items-center space-x-3 mb-4">
          <TeamBadge team={team} size="sm" />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      )}
      
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
};

/**
 * Team vs Team - Component for displaying matchups
 */
interface TeamVsTeamProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date?: string;
  time?: string;
  className?: string;
}

export const TeamVsTeam: React.FC<TeamVsTeamProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  date,
  time,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-4 p-4 rounded-xl bg-white shadow-lg border ${className}`}>
      {/* Away Team */}
      <div className="flex items-center space-x-3 flex-1">
        <TeamBadge team={awayTeam} size="md" />
        <div className="text-right flex-1">
          <div className="font-bold text-lg">{awayTeam}</div>
          {awayScore !== undefined && (
            <div className="text-2xl font-bold text-gray-800">{awayScore}</div>
          )}
        </div>
      </div>

      {/* VS or @ */}
      <div className="text-gray-500 font-bold text-lg px-2">
        {homeScore !== undefined && awayScore !== undefined ? 'vs' : '@'}
      </div>

      {/* Home Team */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="text-left flex-1">
          <div className="font-bold text-lg">{homeTeam}</div>
          {homeScore !== undefined && (
            <div className="text-2xl font-bold text-gray-800">{homeScore}</div>
          )}
        </div>
        <TeamBadge team={homeTeam} size="md" />
      </div>

      {/* Date/Time */}
      {(date || time) && (
        <div className="text-sm text-gray-600 text-center min-w-0">
          {date && <div className="font-semibold">{date}</div>}
          {time && <div>{time}</div>}
        </div>
      )}
    </div>
  );
};

/**
 * Team Select - Dropdown with team colors
 */
interface TeamSelectProps {
  value: string;
  onChange: (team: string) => void;
  teams?: string[];
  placeholder?: string;
  className?: string;
}

export const TeamSelect: React.FC<TeamSelectProps> = ({
  value,
  onChange,
  teams,
  placeholder = "Select a team",
  className = ''
}) => {
  // Use provided teams or get all teams from our color data
  const availableTeams = teams || Object.keys(require('@/utils/teamColors').NHL_TEAM_COLORS).sort();
  
  const selectedTeamColors = value ? getTeamCSSVariables(value) : {};

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 rounded-xl border-2 font-semibold
          focus:ring-2 focus:ring-offset-2 transition-all duration-200
          ${className}
        `}
        style={{
          ...(value ? selectedTeamColors : {}),
          backgroundColor: value ? 'var(--team-primary)' : '#ffffff',
          color: value ? 'var(--team-text-primary)' : '#000000',
          borderColor: value ? 'var(--team-secondary)' : '#d1d5db'
        } as React.CSSProperties}
      >
        <option value="">{placeholder}</option>
        {availableTeams.map(team => (
          <option key={team} value={team} style={{ backgroundColor: '#ffffff', color: '#000000' }}>
            {team}
          </option>
        ))}
      </select>
      
      {value && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <TeamBadge team={value} size="sm" showText={false} />
        </div>
      )}
    </div>
  );
};

/**
 * Team Stats Bar - Horizontal bar with team colors for displaying percentages
 */
interface TeamStatsBarProps extends BaseTeamProps {
  value: number;
  maxValue?: number;
  label?: string;
  showPercentage?: boolean;
}

export const TeamStatsBar: React.FC<TeamStatsBarProps> = ({
  team,
  value,
  maxValue = 100,
  label,
  showPercentage = true,
  className = ''
}) => {
  const cssVars = getTeamCSSVariables(team);
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="font-semibold">{label}</span>
          {showPercentage && <span className="text-sm">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            ...cssVars,
            width: `${percentage}%`,
            background: 'var(--team-gradient)'
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};
