'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';

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

  // Load available teams
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetch('/api/teams-list');
        if (response.ok) {
          const data = await response.json();
          setAvailableTeams(data.teams);
        }
      } catch (err) {
        console.error('Failed to load teams:', err);
      }
    };
    loadTeams();
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

  const handleGameClick = (gameId: string) => {
    router.push(`/games/${gameId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏒</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hockey Games
          </h1>
        </div>
        <p className="text-lg data-text-secondary">
          Showing <span className="font-bold data-text">{games.length}</span> of <span className="font-bold data-text">{totalCount.toLocaleString()}</span> games
        </p>
        <div className="mt-3 inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
          <span className="text-lg">💡</span>
          <span className="text-sm font-medium text-blue-700">
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
            <select
              id="team"
              value={filters.team}
              onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white data-text transition-all duration-200 hover:border-blue-300"
            >
              <option value="">All Teams</option>
              {availableTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="season" className="block text-sm font-semibold data-text-secondary mb-3">
              📅 Season
            </label>
            <select
              id="season"
              value={filters.season}
              onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white data-text transition-all duration-200 hover:border-blue-300"
            >
              <option value="">All Seasons</option>
              <option value="2024">2024-25</option>
              <option value="2023">2023-24</option>
              <option value="2022">2022-23</option>
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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 animate-pulse"></div>
          </div>
          <p className="mt-4 text-lg font-medium data-text-secondary">Loading games data...</p>
          <p className="text-sm data-text-muted">Please wait while we fetch the latest game statistics</p>
        </div>
      ) : (
        <div className="space-y-6">
          {games.map((game) => (
            <div 
              key={game.game_id} 
              className="modern-card hover-lift cursor-pointer rounded-xl p-6 group border-l-4 border-l-blue-500 hover:border-l-purple-500 transition-all duration-300"
              onClick={() => handleGameClick(game.game_id)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Game Info */}
                <div className="lg:col-span-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold data-text group-hover:text-blue-600 transition-colors">{game.team}</span>
                      <span className="text-xl data-text-muted font-medium">vs</span>
                      <span className="text-2xl font-bold data-text group-hover:text-purple-600 transition-colors">{game.opposing_team}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
                  <div className="space-y-1">
                    <p className="text-sm data-text-secondary font-medium">📅 {formatDate(game.game_date)}</p>
                    <p className="text-xs data-text-muted">Game #{game.game_id} • ⏱️ {formatTime(game.ice_time)}</p>
                  </div>
                </div>

                {/* Score & Key Stats */}
                <div className="lg:col-span-4 text-center">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                    <h4 className="text-sm font-semibold data-text-secondary mb-2 uppercase tracking-wide">Final Score</h4>
                    <div className={`text-4xl font-bold mb-2 ${getResultColor(game.goals_for, game.goals_against)}`}>
                      {game.goals_for} - {game.goals_against}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="data-text font-bold text-lg">{game.shots_on_goal_for} - {game.shots_on_goal_against}</div>
                        <div className="data-text-muted text-xs font-medium">Shots on Goal</div>
                      </div>
                      <div className="text-center">
                        <div className="data-text font-bold text-lg">{game.x_goals_for.toFixed(1)} - {game.x_goals_against.toFixed(1)}</div>
                        <div className="data-text-muted text-xs font-medium">Expected Goals</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Stats */}
                <div className="lg:col-span-4">
                  <h4 className="text-sm font-semibold data-text-secondary mb-3 uppercase tracking-wide">📊 Advanced Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">{(game.corsi_percentage * 100).toFixed(1)}%</div>
                      <div className="text-xs data-text-muted font-medium">Corsi</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-purple-600">{(game.fenwick_percentage * 100).toFixed(1)}%</div>
                      <div className="text-xs data-text-muted font-medium">Fenwick</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-bold data-text">{game.face_offs_won_for}-{game.face_offs_won_against}</div>
                      <div className="text-xs data-text-muted font-medium">Face-offs</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-bold data-text">{game.hits_for}-{game.hits_against}</div>
                      <div className="text-xs data-text-muted font-medium">Hits</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  👆 Click to view detailed analytics
                </span>
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {games.length < totalCount && (
            <div className="text-center py-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
