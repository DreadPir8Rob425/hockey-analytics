'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import { TeamHeader, TeamVsTeam, TeamBadge, TeamStatsBar, TeamCard } from '@/components/team/TeamComponents';
import { getTeamColors, getTeamCSSVariables } from '@/utils/teamColors';

interface GameDetails {
  id: number;
  team: string;
  season: number;
  game_id: string;
  opposing_team: string;
  home_or_away: string;
  game_date: string;
  goals_for: number;
  goals_against: number;
  shots_on_goal_for: number;
  shots_on_goal_against: number;
  x_goals_for: number;
  x_goals_against: number;
  corsi_percentage: number;
  fenwick_percentage: number;
  face_offs_won_for: number;
  face_offs_won_against: number;
  hits_for: number;
  hits_against: number;
  penalties_for: number;
  penalties_against: number;
  ice_time: number;
  situations: Record<string, any>;
  analytics: {
    shootingPercentage: string;
    savePercentage: string;
    pdo: string;
    xgDifferential: string;
    actualDifferential: number;
    xgOutperformance: string;
  };
  periodBreakdown: Record<number, any>;
  shots: any[];
}

export default function GameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/games/${gameId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch game details');
        }

        const data = await response.json();
        setGame(data.game);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultColor = (goalsFor: number, goalsAgainst: number) => {
    if (goalsFor > goalsAgainst) return 'text-green-600';
    if (goalsFor < goalsAgainst) return 'text-red-600';
    return 'text-yellow-600';
  };

  const renderSituationStats = (situation: any, title: string) => {
    const getBadgeStyle = () => {
      if (title.includes('5-on-5')) return 'var(--gradient-navy)';
      if (title.includes('5-on-4')) return 'var(--gradient-secondary)';
      if (title.includes('4-on-5')) return 'var(--hockey-red-dark)';
      return 'var(--steel-gray-dark)';
    };
    
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border-2 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" style={{borderColor: 'var(--ice-blue-dark)'}}>
        <div className="inline-flex items-center px-4 py-2 rounded-full text-white font-bold text-sm mb-6" style={{background: getBadgeStyle()}}>
          {title}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
            <div className="text-center">
              <div className="text-3xl font-black mb-2" style={{color: 'var(--deep-navy)'}}>
                {situation.goals_for}<span className="mx-2" style={{color: 'var(--steel-gray)'}}>-</span>{situation.goals_against}
              </div>
              <div className="font-bold text-sm uppercase tracking-wider" style={{color: 'var(--steel-gray)'}}>Goals</div>
            </div>
          </div>
          
          <div className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
            <div className="text-center">
              <div className="text-3xl font-black mb-2" style={{color: 'var(--deep-navy)'}}>
                {situation.shots_on_goal_for}<span className="mx-2" style={{color: 'var(--steel-gray)'}}>-</span>{situation.shots_on_goal_against}
              </div>
              <div className="font-bold text-sm uppercase tracking-wider" style={{color: 'var(--steel-gray)'}}>Shots</div>
            </div>
          </div>
          
          <div className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
            <div className="text-center">
              <div className="text-3xl font-black mb-2" style={{color: 'var(--deep-navy)'}}>
                {situation.x_goals_for?.toFixed(1)}<span className="mx-2" style={{color: 'var(--steel-gray)'}}>-</span>{situation.x_goals_against?.toFixed(1)}
              </div>
              <div className="font-bold text-sm uppercase tracking-wider" style={{color: 'var(--steel-gray)'}}>xGoals</div>
            </div>
          </div>
          
          <div className="rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
            <div className="text-center">
              <div className="text-3xl font-black mb-2" style={{color: 'var(--hockey-red)'}}>
                {(situation.corsi_percentage * 100).toFixed(1)}%
              </div>
              <div className="font-bold text-sm uppercase tracking-wider" style={{color: 'var(--steel-gray)'}}>Corsi</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-4" style={{borderColor: 'var(--ice-blue-dark)', borderTopColor: 'var(--hockey-red)'}}></div>
            <div className="absolute inset-0 rounded-full opacity-30 animate-pulse" style={{background: 'var(--gradient-navy)'}}></div>
          </div>
          <h2 className="text-3xl font-black mb-3 text-center" style={{color: 'var(--deep-navy)'}}>Loading Game Details</h2>
          <p className="font-medium text-lg" style={{color: 'var(--steel-gray)'}}>Fetching comprehensive analytics and statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen gradient-hero">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-2xl mx-auto" style={{border: '1px solid var(--ice-blue-dark)'}}>
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{background: 'var(--ice-blue)'}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'var(--hockey-red)'}}>
                  <span className="text-white font-bold text-xl">!</span>
                </div>
              </div>
              <h1 className="text-4xl font-black mb-4" style={{color: 'var(--hockey-red)'}}>Game Not Found</h1>
              <p className="text-xl font-medium" style={{color: 'var(--steel-gray)'}}>{error || 'The requested game could not be found'}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                style={{background: 'var(--gradient-navy)'}}
              >
                ← Go Back
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                style={{background: 'var(--gradient-secondary)'}}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="mb-6 group flex items-center space-x-3 transition-colors duration-200 bg-white px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl"
            style={{color: 'var(--deep-navy)'}}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200" style={{background: 'var(--gradient-navy)'}}>
              <span className="text-white font-bold">←</span>
            </div>
            <span className="font-bold" style={{color: 'var(--steel-gray)'}}>Back to Games</span>
          </button>
          
          {/* Game Matchup Header with Team Colors */}
          <TeamHeader
            team={game.team}
            title={`${game.team} vs ${game.opposing_team}`}
            subtitle={`${formatDate(game.game_date)} • Game ID: ${game.game_id}`}
            className="mb-6"
          >
            <div className="text-right">
              <div className={`px-4 py-2 text-sm font-bold rounded-full mb-4 ${
                game.home_or_away === 'HOME' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {game.home_or_away === 'HOME' ? '🏠 HOME' : '✈️ AWAY'}
              </div>
              <div className="text-center bg-white rounded-2xl p-4 border-2 shadow-lg" style={{borderColor: 'var(--team-secondary)'}}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{color: 'var(--team-primary)'}}>
                  Final Score
                </h3>
                <div className={`text-4xl font-black mb-1 ${getResultColor(game.goals_for, game.goals_against)}`}>
                  {game.goals_for} - {game.goals_against}
                </div>
                <div className="text-sm font-bold" style={{color: 'var(--team-primary)'}}>
                  {game.goals_for > game.goals_against ? 'Victory' : game.goals_for < game.goals_against ? 'Loss' : 'Tie'}
                </div>
              </div>
            </div>
          </TeamHeader>
          
          {/* Team vs Team Matchup */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 mb-6" style={{borderColor: 'var(--ice-blue-dark)'}}>
            <TeamVsTeam
              homeTeam={game.home_or_away === 'HOME' ? game.team : game.opposing_team}
              awayTeam={game.home_or_away === 'HOME' ? game.opposing_team : game.team}
              homeScore={game.home_or_away === 'HOME' ? game.goals_for : game.goals_against}
              awayScore={game.home_or_away === 'HOME' ? game.goals_against : game.goals_for}
              date={formatDate(game.game_date)}
              className="border-0 shadow-none bg-transparent p-0"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
        <div className="bg-white rounded-2xl p-3 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
          <nav className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'situations', label: 'Situations' },
              { id: 'analytics', label: 'Advanced Analytics' },
              { id: 'periods', label: 'Period Breakdown' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg transform scale-105'
                      : 'hover:scale-102'
                  }`}
                  style={{
                    background: activeTab === tab.id ? 'var(--gradient-secondary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--steel-gray)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'var(--ice-blue)';
                      e.currentTarget.style.color = 'var(--deep-navy)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--steel-gray)';
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
              <h3 className="text-2xl font-black mb-6 flex items-center space-x-3" style={{color: 'var(--deep-navy)'}}>
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg text-lg font-black" style={{background: 'var(--gradient-navy)'}}>G</span>
                <span>Game Statistics</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Shots on Goal</span>
                  <span className="text-slate-900 font-black text-xl">{game.shots_on_goal_for} - {game.shots_on_goal_against}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Expected Goals</span>
                  <span className="text-slate-900 font-black text-xl">{game.x_goals_for.toFixed(2)} - {game.x_goals_against.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="font-bold" style={{color: 'var(--steel-gray)'}}>Shooting %</span>
                  <span className="font-black text-xl" style={{color: 'var(--deep-navy)'}}>{game.analytics.shootingPercentage}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="font-bold" style={{color: 'var(--steel-gray)'}}>Save %</span>
                  <span className="font-black text-xl" style={{color: 'var(--professional-blue)'}}>{game.analytics.savePercentage}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Face-off Wins</span>
                  <span className="text-slate-900 font-black text-xl">{game.face_offs_won_for} - {game.face_offs_won_against}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Hits</span>
                  <span className="text-slate-900 font-black text-xl">{game.hits_for} - {game.hits_against}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-slate-600 font-bold">Penalty Minutes</span>
                  <span className="text-orange-600 font-black text-xl">{game.penalties_for} - {game.penalties_against}</span>
                </div>
              </div>
            </div>

            {/* Advanced Metrics with Team Colors */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
              <h3 className="text-2xl font-black mb-6 flex items-center space-x-3" style={{color: 'var(--deep-navy)'}}>
                <TeamBadge team={game.team} size="sm" showText={false} />
                <span>Team Performance Metrics</span>
              </h3>
              <div className="space-y-6">
                <TeamStatsBar
                  team={game.team}
                  value={game.corsi_percentage * 100}
                  label={`${game.team} Corsi Percentage`}
                  className="mb-4"
                />
                <TeamStatsBar
                  team={game.team}
                  value={game.fenwick_percentage * 100}
                  label={`${game.team} Fenwick Percentage`}
                  className="mb-4"
                />
                <TeamStatsBar
                  team={game.team}
                  value={parseFloat(game.analytics.shootingPercentage)}
                  maxValue={20}
                  label={`${game.team} Shooting Percentage`}
                  className="mb-4"
                />
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">PDO</span>
                  <span className={`font-black text-xl ${
                    parseFloat(game.analytics.pdo) > 100 ? 'text-green-600' : 'text-orange-600'
                  }`}>{game.analytics.pdo}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">xG Differential</span>
                  <span className={`font-black text-xl ${parseFloat(game.analytics.xgDifferential) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(game.analytics.xgDifferential) > 0 ? '+' : ''}{game.analytics.xgDifferential}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">Goal Differential</span>
                  <span className={`font-black text-xl ${game.analytics.actualDifferential > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {game.analytics.actualDifferential > 0 ? '+' : ''}{game.analytics.actualDifferential}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-slate-600 font-bold">xG Outperformance</span>
                  <span className={`font-black text-xl ${parseFloat(game.analytics.xgOutperformance) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(game.analytics.xgOutperformance) > 0 ? '+' : ''}{game.analytics.xgOutperformance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'situations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {game.situations['5on5'] && renderSituationStats(game.situations['5on5'], 'Even Strength (5-on-5)')}
            {game.situations['5on4'] && renderSituationStats(game.situations['5on4'], 'Power Play (5-on-4)')}
            {game.situations['4on5'] && renderSituationStats(game.situations['4on5'], 'Penalty Kill (4-on-5)')}
            {game.situations['other'] && renderSituationStats(game.situations['other'], 'Other Situations')}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
              <h3 className="text-3xl font-black mb-8 flex items-center space-x-3" style={{color: 'var(--deep-navy)'}}>
                <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shadow-lg font-black" style={{background: 'var(--gradient-navy)'}}>P</span>
                <span>Performance Analysis</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 rounded-2xl border-2 shadow-lg" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{background: 'var(--gradient-navy)'}}>
                    <span className="text-white font-bold text-lg">PDO</span>
                  </div>
                  <div className={`text-4xl font-black mb-3`} style={{color: parseFloat(game.analytics.pdo) > 100 ? 'var(--deep-navy)' : 'var(--hockey-red)'}}>{game.analytics.pdo}</div>
                  <div className="text-base font-black mb-2" style={{color: 'var(--deep-navy)'}}>PDO</div>
                  <div className="text-sm font-bold" style={{color: 'var(--steel-gray)'}}>
                    {parseFloat(game.analytics.pdo) > 100 ? 'Above Average' : 'Below Average'}
                  </div>
                </div>
                
                <div className="text-center p-8 rounded-2xl border-2 shadow-lg" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{background: 'var(--gradient-secondary)'}}>
                    <span className="text-white font-bold text-lg">xG</span>
                  </div>
                  <div className={`text-4xl font-black mb-3 ${parseFloat(game.analytics.xgDifferential) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(game.analytics.xgDifferential) > 0 ? '+' : ''}{game.analytics.xgDifferential}
                  </div>
                  <div className="text-base font-black mb-2" style={{color: 'var(--deep-navy)'}}>xG Differential</div>
                  <div className="text-sm font-bold" style={{color: 'var(--steel-gray)'}}>
                    Expected Goals Advantage
                  </div>
                </div>
                
                <div className="text-center p-8 rounded-2xl border-2 shadow-lg" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{background: 'var(--steel-gray-dark)'}}>
                    <span className="text-white font-bold text-lg">VS</span>
                  </div>
                  <div className={`text-4xl font-black mb-3 ${parseFloat(game.analytics.xgOutperformance) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(game.analytics.xgOutperformance) > 0 ? '+' : ''}{game.analytics.xgOutperformance}
                  </div>
                  <div className="text-base font-black mb-2" style={{color: 'var(--deep-navy)'}}>vs Expected</div>
                  <div className="text-sm font-bold" style={{color: 'var(--steel-gray)'}}>
                    Goals vs xG Performance
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional performance insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
                <h4 className="text-2xl font-black mb-6 flex items-center space-x-3" style={{color: 'var(--deep-navy)'}}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg text-lg font-black" style={{background: 'var(--gradient-navy)'}}>O</span>
                  <span>Offensive Performance</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="font-bold" style={{color: 'var(--steel-gray)'}}>Shooting %</span>
                    <span className="font-black text-xl" style={{color: 'var(--deep-navy)'}}>{game.analytics.shootingPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600 font-bold">Goals For</span>
                    <span className="text-green-600 font-black text-xl">{game.goals_for}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-600 font-bold">Shots For</span>
                    <span className="text-slate-900 font-black text-xl">{game.shots_on_goal_for}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
                <h4 className="text-2xl font-black mb-6 flex items-center space-x-3" style={{color: 'var(--deep-navy)'}}>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg text-lg font-black" style={{background: 'var(--gradient-secondary)'}}>D</span>
                  <span>Defensive Performance</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="font-bold" style={{color: 'var(--steel-gray)'}}>Save %</span>
                    <span className="font-black text-xl" style={{color: 'var(--professional-blue)'}}>{game.analytics.savePercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600 font-bold">Goals Against</span>
                    <span className="text-red-600 font-black text-xl">{game.goals_against}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-600 font-bold">Shots Against</span>
                    <span className="text-slate-900 font-black text-xl">{game.shots_on_goal_against}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'periods' && (
          <div className="space-y-8">
            {/* Period-by-Period Visual */}
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
              <h3 className="text-3xl font-black mb-8 flex items-center space-x-3" style={{color: 'var(--deep-navy)'}}>
                <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shadow-lg font-black" style={{background: 'var(--gradient-secondary)'}}>T</span>
                <span>Period-by-Period Performance</span>
              </h3>
              {Object.keys(game.periodBreakdown).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.entries(game.periodBreakdown).map(([period, stats]) => (
                    <div key={period} className="rounded-2xl p-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
                      <h4 className="text-xl font-black text-center mb-6 flex items-center justify-center space-x-2" style={{color: 'var(--deep-navy)'}}>
                        <span className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black shadow-lg" style={{background: 'var(--gradient-navy)'}}>{period}</span>
                        <span>Period {period}</span>
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 border-2 shadow-lg" style={{borderColor: 'var(--ice-blue-dark)'}}>
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold" style={{color: 'var(--steel-gray)'}}>Goals:</span>
                            <span className={`text-2xl font-black ${stats.goals_for > stats.goals_against ? 'text-green-600' : stats.goals_for < stats.goals_against ? 'text-red-600' : 'text-slate-800'}`}>
                              {stats.goals_for} - {stats.goals_against}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border-2 shadow-lg" style={{borderColor: 'var(--ice-blue-dark)'}}>
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold" style={{color: 'var(--steel-gray)'}}>Shots:</span>
                            <span className="text-2xl font-black" style={{color: 'var(--deep-navy)'}}>{stats.for} - {stats.against}</span>
                          </div>
                        </div>
                        {/* Visual shot representation */}
                        <div className="bg-white rounded-2xl p-6 border-2 shadow-lg" style={{borderColor: 'var(--ice-blue-dark)'}}>
                          <div className="flex justify-between text-sm font-bold mb-3" style={{color: 'var(--steel-gray)'}}>
                            <span>Shots For</span>
                            <span>Shots Against</span>
                          </div>
                          <div className="flex h-8 rounded-full overflow-hidden border-2 shadow-inner" style={{borderColor: 'var(--ice-blue-dark)'}}>
                            <div 
                              className="flex items-center justify-center" 
                              style={{ 
                                width: `${(stats.for / (stats.for + stats.against) * 100) || 50}%`,
                                background: 'var(--gradient-navy)'
                              }}
                            >
                              <span className="text-white text-sm font-black">{stats.for}</span>
                            </div>
                            <div 
                              className="flex items-center justify-center" 
                              style={{ 
                                width: `${(stats.against / (stats.for + stats.against) * 100) || 50}%`,
                                background: 'var(--gradient-secondary)'
                              }}
                            >
                              <span className="text-white text-sm font-black">{stats.against}</span>
                            </div>
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-base font-black" style={{color: 'var(--deep-navy)'}}>Shot Share: {stats.for > 0 ? ((stats.for / (stats.for + stats.against)) * 100).toFixed(1) : '0.0'}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="w-12 h-12 bg-slate-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-xl">?</span>
                    </div>
                  </div>
                  <p className="text-xl font-black text-slate-600">No period breakdown data available</p>
                </div>
              )}
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2" style={{borderColor: 'var(--ice-blue-dark)'}}>
              <h3 className="text-3xl font-black mb-8 flex items-center space-x-3" style={{color: 'var(--deep-navy)'}}>
                <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shadow-lg font-black" style={{background: 'var(--steel-gray-dark)'}}>S</span>
                <span>Detailed Statistics</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-base font-black uppercase tracking-wider" style={{color: 'var(--deep-navy)'}}>Period</th>
                      <th className="px-6 py-4 text-left text-base font-black uppercase tracking-wider" style={{color: 'var(--deep-navy)'}}>Goals For</th>
                      <th className="px-6 py-4 text-left text-base font-black uppercase tracking-wider" style={{color: 'var(--deep-navy)'}}>Goals Against</th>
                      <th className="px-6 py-4 text-left text-base font-black uppercase tracking-wider" style={{color: 'var(--deep-navy)'}}>Shots For</th>
                      <th className="px-6 py-4 text-left text-base font-black uppercase tracking-wider" style={{color: 'var(--deep-navy)'}}>Shots Against</th>
                      <th className="px-6 py-4 text-left text-base font-black uppercase tracking-wider" style={{color: 'var(--deep-navy)'}}>Shot Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(game.periodBreakdown).map(([period, stats], index) => (
                      <tr key={period} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-slate-25' : 'bg-white'}`}>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg" style={{background: 'var(--gradient-navy)'}}>{period}</span>
                            <span className="text-base font-black" style={{color: 'var(--deep-navy)'}}>Period {period}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-base font-black text-green-600">{stats.goals_for}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-base font-black text-red-600">{stats.goals_against}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-base font-black text-blue-600">{stats.for}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-base font-black text-orange-600">{stats.against}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full shadow-lg ${stats.for > stats.against ? 'bg-green-500' : stats.for < stats.against ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-base font-black text-slate-800">
                              {stats.for > 0 ? ((stats.for / (stats.for + stats.against)) * 100).toFixed(1) : '0.0'}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
