'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import { TeamVsTeam, TeamSelect, TeamBadge, TeamStatsBar } from '@/components/team/TeamComponents';
import { getAllTeamAbbreviations } from '@/utils/teamColors';

interface Game {
  id: number;
  team: string;
  season: number;
  game_id: string;
  opposing_team: string;
  home_or_away: string;
  game_date: string;
  position: string;
  situation: string;
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
}

interface GamesResponse {
  games: Game[];
  count: number;
  totalCount: number;
  hasMore: boolean;
}

export default function GamesPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    team: '',
    season: '',
    limit: 25,
    offset: 0
  });
  const [totalCount, setTotalCount] = useState(0);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.team) params.append('team', filters.team);
      if (filters.season) params.append('season', filters.season);
      params.append('limit', filters.limit.toString());
      params.append('offset', filters.offset.toString());

      const response = await fetch(`/api/games?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data: GamesResponse = await response.json();
      
      if (filters.offset === 0) {
        setGames(data.games);
      } else {
        setGames(prev => [...prev, ...data.games]);
      }
      
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, offset: 0 }));
  }, [filters.team, filters.season]);

  useEffect(() => {
    fetchGames();
  }, [filters]);

  // Hardcoded list of all NHL teams (more reliable than API sampling)
  useEffect(() => {
    const allNHLTeams = [
      'ANA', 'ARI', 'ATL', 'BOS', 'BUF', 'CAR', 'CBJ', 'CGY', 'CHI', 'COL',
      'DAL', 'DET', 'EDM', 'FLA', 'L.A', 'LAK', 'MIN', 'MTL', 'NJD', 'NSH',
      'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'S.J', 'SEA', 'SJS', 'STL', 'T.B',
      'TBL', 'TOR', 'UTA', 'VAN', 'VGK', 'WPG', 'WSH'
    ];
    setAvailableTeams(allNHLTeams);
  }, []);

  const loadMore = () => {
    setFilters(prev => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const resetFilters = () => {
    setFilters({
      team: '',
      season: '',
      limit: 25,
      offset: 0
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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

  const handleGameClick = (id: number) => {
    router.push(`/games/${id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Error Loading Games</h1>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full shadow-ice flex items-center justify-center" style={{background: 'var(--gradient-navy)'}}>
            <span className="text-white font-bold text-lg">🏒</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(135deg, var(--deep-navy) 0%, var(--professional-blue) 100%)'}}>
            Hockey Games
          </h1>
        </div>
        <p className="text-lg" style={{color: 'var(--steel-gray)'}}>
          Showing <span className="font-bold" style={{color: 'var(--deep-navy)'}}>{games.length}</span> of <span className="font-bold" style={{color: 'var(--deep-navy)'}}>{totalCount.toLocaleString()}</span> games
        </p>
        <div className="mt-3 inline-flex items-center space-x-2 px-4 py-2 rounded-full border" style={{background: 'var(--ice-blue)', borderColor: 'var(--ice-blue-dark)'}}>
          <span className="text-lg">💡</span>
          <span className="text-sm font-medium" style={{color: 'var(--hockey-red)'}}>
            Click on any game to view detailed analytics and advanced statistics
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="modern-card rounded-xl p-6 mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold data-text mb-1">Filter Games</h3>
          <p className="text-sm data-text-muted">Narrow down your search to find specific games</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="team" className="block text-sm font-semibold data-text-secondary mb-3">
              🏒 Team
            </label>
            <TeamSelect
              value={filters.team}
              onChange={(team) => setFilters(prev => ({ ...prev, team }))}
              teams={availableTeams}
              placeholder="All Teams"
              className="focus:ring-2 focus:ring-offset-2"
            />
          </div>

          <div>
            <label htmlFor="season" className="block text-sm font-semibold data-text-secondary mb-3">
              📅 Season
            </label>
            <select
              id="season"
              value={filters.season}
              onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))}
              className="w-full border-2 rounded-xl px-4 py-3 focus:ring-2 bg-white data-text transition-all duration-200"
              style={{
                borderColor: 'var(--ice-blue-dark)',
                '--tw-ring-color': 'var(--hockey-red)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--hockey-red)';
                e.target.style.boxShadow = '0 0 0 2px rgba(197, 48, 48, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--ice-blue-dark)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Seasons</option>
              <option value="2024">2024-25</option>
              <option value="2023">2023-24</option>
              <option value="2022">2022-23</option>
              <option value="2021">2021-22</option>
              <option value="2020">2020-21</option>
              <option value="2019">2019-20</option>
              <option value="2018">2018-19</option>
              <option value="2017">2017-18</option>
              <option value="2016">2016-17</option>
              <option value="2015">2015-16</option>
              <option value="2014">2014-15</option>
              <option value="2013">2013-14</option>
              <option value="2012">2012-13</option>
              <option value="2011">2011-12</option>
              <option value="2010">2010-11</option>
              <option value="2009">2009-10</option>
              <option value="2008">2008-09</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              🔄 Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Games List */}
      {loading && games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4" style={{borderColor: 'var(--ice-blue-dark)', borderTopColor: 'var(--hockey-red)'}}></div>
            <div className="absolute inset-0 rounded-full opacity-20 animate-pulse" style={{background: 'var(--gradient-secondary)'}}></div>
          </div>
          <p className="mt-4 text-lg font-medium" style={{color: 'var(--deep-navy)'}}>Loading games data...</p>
          <p className="text-sm" style={{color: 'var(--steel-gray)'}}>Please wait while we fetch the latest game statistics</p>
        </div>
      ) : (
        <div className="space-y-6">
          {games.map((game) => {
            // Determine home/away teams for proper TeamVsTeam display
            const homeTeam = game.home_or_away === 'HOME' ? game.team : game.opposing_team;
            const awayTeam = game.home_or_away === 'HOME' ? game.opposing_team : game.team;
            const homeScore = game.home_or_away === 'HOME' ? game.goals_for : game.goals_against;
            const awayScore = game.home_or_away === 'HOME' ? game.goals_against : game.goals_for;
            
            return (
            <div 
              key={game.id} 
              className="modern-card hover-lift cursor-pointer rounded-xl overflow-hidden group transition-all duration-300 border-2"
              style={{
                borderColor: 'var(--ice-blue-dark)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--hockey-red)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(197, 48, 48, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--ice-blue-dark)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => handleGameClick(game.id)}
            >
              {/* Main Team Matchup */}
              <div className="p-6 pb-4">
                <TeamVsTeam
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeScore={homeScore}
                  awayScore={awayScore}
                  date={formatDate(game.game_date)}
                  className="border-0 shadow-none bg-transparent p-0"
                />
              </div>

              {/* Game Details */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      game.home_or_away === 'HOME' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {game.home_or_away === 'HOME' ? '🏠 HOME' : '✈️ AWAY'}
                    </span>
                    <span className="text-xs font-medium data-text-muted bg-gray-100 px-2 py-1 rounded-full">
                      {game.season}-{(game.season + 1).toString().slice(-2)}
                    </span>
                  </div>
                  <div className="text-xs data-text-muted">
                    Game #{game.game_id} • ⏱️ {formatTime(game.ice_time)}
                  </div>
                </div>
              </div>

              {/* Team-Colored Stats Section */}
              <div className="px-6 pb-4">
                <h4 className="text-sm font-semibold data-text-secondary mb-4 uppercase tracking-wide">📊 Advanced Metrics</h4>
                <div className="space-y-3">
                  <TeamStatsBar
                    team={game.team}
                    value={game.corsi_percentage * 100}
                    label={`${game.team} Corsi %`}
                    className="mb-2"
                  />
                  <TeamStatsBar
                    team={game.team}
                    value={game.fenwick_percentage * 100}
                    label={`${game.team} Fenwick %`}
                    className="mb-2"
                  />
                </div>
              </div>

              {/* Additional Stats Grid */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="ice-card rounded-lg p-2">
                    <div className="text-sm font-bold data-text">{game.shots_on_goal_for}-{game.shots_on_goal_against}</div>
                    <div className="text-xs data-text-muted font-medium">SOG</div>
                  </div>
                  <div className="ice-card rounded-lg p-2">
                    <div className="text-sm font-bold data-text">{game.x_goals_for.toFixed(1)}-{game.x_goals_against.toFixed(1)}</div>
                    <div className="text-xs data-text-muted font-medium">xG</div>
                  </div>
                  <div className="ice-card rounded-lg p-2">
                    <div className="text-sm font-bold data-text">{game.face_offs_won_for}-{game.face_offs_won_against}</div>
                    <div className="text-xs data-text-muted font-medium">FOW</div>
                  </div>
                  <div className="ice-card rounded-lg p-2">
                    <div className="text-sm font-bold data-text">{game.hits_for}-{game.hits_against}</div>
                    <div className="text-xs data-text-muted font-medium">Hits</div>
                  </div>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-medium px-3 py-1 rounded-full" style={{color: 'var(--hockey-red)', background: 'var(--ice-blue)'}}>
                    👆 Click to view detailed analytics
                  </span>
                </div>
              </div>
            </div>
          );
          })}

          {/* Load More Button */}
          {games.length < totalCount && (
            <div className="text-center py-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="relative text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{background: 'var(--gradient-secondary)'}}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'var(--hockey-red-dark)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--gradient-secondary)';
                }}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Loading more games...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>⬇️ Load More Games</span>
                    <span className="text-sm opacity-75">({totalCount - games.length} remaining)</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
