'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';

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
      if (title.includes('5-on-5')) return 'bg-gradient-to-r from-emerald-500 to-teal-500';
      if (title.includes('5-on-4')) return 'bg-gradient-to-r from-amber-500 to-orange-500';
      if (title.includes('4-on-5')) return 'bg-gradient-to-r from-red-500 to-pink-500';
      return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    };
    
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-bold text-sm mb-6 ${getBadgeStyle()}`}>
          <span className="mr-2">⚡</span>
          {title}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-800 mb-2">
                {situation.goals_for}<span className="text-emerald-400 mx-2">-</span>{situation.goals_against}
              </div>
              <div className="text-emerald-600 font-bold text-sm uppercase tracking-wider">🥅 Goals</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="text-3xl font-black text-blue-800 mb-2">
                {situation.shots_on_goal_for}<span className="text-blue-400 mx-2">-</span>{situation.shots_on_goal_against}
              </div>
              <div className="text-blue-600 font-bold text-sm uppercase tracking-wider">🎯 Shots</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="text-3xl font-black text-purple-800 mb-2">
                {situation.x_goals_for?.toFixed(1)}<span className="text-purple-400 mx-2">-</span>{situation.x_goals_against?.toFixed(1)}
              </div>
              <div className="text-purple-600 font-bold text-sm uppercase tracking-wider">📊 xGoals</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="text-3xl font-black text-orange-800 mb-2">
                {(situation.corsi_percentage * 100).toFixed(1)}%
              </div>
              <div className="text-orange-600 font-bold text-sm uppercase tracking-wider">📈 Corsi</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-white/30 border-t-blue-500 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-30 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 text-center">Loading Game Details</h2>
          <p className="text-slate-600 font-medium text-lg">Fetching comprehensive analytics and statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-200">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-red-200 text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">⚠️</span>
              </div>
              <h1 className="text-4xl font-black text-red-700 mb-4">Game Not Found</h1>
              <p className="text-red-600 text-xl font-medium">{error || 'The requested game could not be found'}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                ← Go Back
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="mb-6 group flex items-center space-x-3 text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-white px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
              <span className="text-white font-bold">←</span>
            </div>
            <span className="font-bold text-slate-700">Back to Games</span>
          </button>
          
          <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-blue-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-5xl font-black text-slate-800">{game.team}</h1>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-sm">VS</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-800">{game.opposing_team}</h1>
                  </div>
                  <div className={`px-6 py-3 text-sm font-black rounded-full shadow-lg ${
                    game.home_or_away === 'HOME' 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  }`}>
                    {game.home_or_away === 'HOME' ? '🏠 HOME GAME' : '✈️ AWAY GAME'}
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <p className="text-xl text-slate-600 font-bold flex items-center space-x-2">
                    <span>📅</span>
                    <span>{formatDate(game.game_date)}</span>
                  </p>
                  <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                  <p className="text-slate-500 font-semibold">Game ID: {game.game_id}</p>
                </div>
              </div>
              
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="text-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border-2 border-slate-200 shadow-xl">
                  <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider mb-3">Final Score</h3>
                  <div className={`text-6xl font-black mb-2 ${getResultColor(game.goals_for, game.goals_against)}`}>
                    {game.goals_for} - {game.goals_against}
                  </div>
                  <div className="text-base text-slate-600 font-bold">
                    {game.goals_for > game.goals_against ? '🏆 Victory' : game.goals_for < game.goals_against ? '😔 Loss' : '🤝 Tie'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-3 shadow-xl border-2 border-slate-100">
            <nav className="flex space-x-2">
              {[
                { id: 'overview', label: '📊 Overview', icon: '📊' },
                { id: 'situations', label: '⚡ Situations', icon: '⚡' },
                { id: 'analytics', label: '🔬 Advanced Analytics', icon: '🔬' },
                { id: 'periods', label: '⏰ Period Breakdown', icon: '⏰' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:scale-102'
                  }`}
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
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center space-x-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white shadow-lg">🏒</span>
                <span>Game Statistics</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">🎯 Shots on Goal</span>
                  <span className="text-slate-900 font-black text-xl">{game.shots_on_goal_for} - {game.shots_on_goal_against}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">📊 Expected Goals</span>
                  <span className="text-slate-900 font-black text-xl">{game.x_goals_for.toFixed(2)} - {game.x_goals_against.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">🎯 Shooting %</span>
                  <span className="text-blue-600 font-black text-xl">{game.analytics.shootingPercentage}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">🥅 Save %</span>
                  <span className="text-purple-600 font-black text-xl">{game.analytics.savePercentage}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">⚪ Face-off Wins</span>
                  <span className="text-slate-900 font-black text-xl">{game.face_offs_won_for} - {game.face_offs_won_against}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">💥 Hits</span>
                  <span className="text-slate-900 font-black text-xl">{game.hits_for} - {game.hits_against}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-slate-600 font-bold">⏱️ Penalty Minutes</span>
                  <span className="text-orange-600 font-black text-xl">{game.penalties_for} - {game.penalties_against}</span>
                </div>
              </div>
            </div>

            {/* Advanced Metrics */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center space-x-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">🔬</span>
                <span>Advanced Metrics</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">📊 Corsi %</span>
                  <span className="text-blue-600 font-black text-xl">{(game.corsi_percentage * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">📈 Fenwick %</span>
                  <span className="text-purple-600 font-black text-xl">{(game.fenwick_percentage * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">⚙️ PDO</span>
                  <span className={`font-black text-xl ${
                    parseFloat(game.analytics.pdo) > 100 ? 'text-green-600' : 'text-orange-600'
                  }`}>{game.analytics.pdo}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">🎯 xG Differential</span>
                  <span className={`font-black text-xl ${parseFloat(game.analytics.xgDifferential) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(game.analytics.xgDifferential) > 0 ? '+' : ''}{game.analytics.xgDifferential}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-200">
                  <span className="text-slate-600 font-bold">🥅 Goal Differential</span>
                  <span className={`font-black text-xl ${game.analytics.actualDifferential > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {game.analytics.actualDifferential > 0 ? '+' : ''}{game.analytics.actualDifferential}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-slate-600 font-bold">🚀 xG Outperformance</span>
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
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2 border-slate-100">
              <h3 className="text-3xl font-black text-slate-800 mb-8 flex items-center space-x-3">
                <span className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">🔬</span>
                <span>Performance Analysis</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-2xl">⚙️</span>
                  </div>
                  <div className={`text-4xl font-black mb-3 ${
                    parseFloat(game.analytics.pdo) > 100 ? 'text-blue-600' : 'text-orange-600'
                  }`}>{game.analytics.pdo}</div>
                  <div className="text-base font-black text-slate-700 mb-2">PDO</div>
                  <div className="text-sm text-slate-600 font-bold">
                    {parseFloat(game.analytics.pdo) > 100 ? '🔼 Above Average' : '🔽 Below Average'}
                  </div>
                </div>
                
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-2xl">🎯</span>
                  </div>
                  <div className={`text-4xl font-black mb-3 ${parseFloat(game.analytics.xgDifferential) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(game.analytics.xgDifferential) > 0 ? '+' : ''}{game.analytics.xgDifferential}
                  </div>
                  <div className="text-base font-black text-slate-700 mb-2">xG Differential</div>
                  <div className="text-sm text-slate-600 font-bold">
                    Expected Goals Advantage
                  </div>
                </div>
                
                <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl border-2 border-purple-200 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-2xl">🚀</span>
                  </div>
                  <div className={`text-4xl font-black mb-3 ${parseFloat(game.analytics.xgOutperformance) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(game.analytics.xgOutperformance) > 0 ? '+' : ''}{game.analytics.xgOutperformance}
                  </div>
                  <div className="text-base font-black text-slate-700 mb-2">vs Expected</div>
                  <div className="text-sm text-slate-600 font-bold">
                    Goals vs xG Performance
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional performance insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100">
                <h4 className="text-2xl font-black text-slate-800 mb-6 flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white shadow-lg">📊</span>
                  <span>Offensive Performance</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600 font-bold">Shooting %</span>
                    <span className="text-blue-600 font-black text-xl">{game.analytics.shootingPercentage}%</span>
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
              
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-100">
                <h4 className="text-2xl font-black text-slate-800 mb-6 flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg">🛑</span>
                  <span>Defensive Performance</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600 font-bold">Save %</span>
                    <span className="text-purple-600 font-black text-xl">{game.analytics.savePercentage}%</span>
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
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2 border-slate-100">
              <h3 className="text-3xl font-black text-slate-800 mb-8 flex items-center space-x-3">
                <span className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">⏰</span>
                <span>Period-by-Period Performance</span>
              </h3>
              {Object.keys(game.periodBreakdown).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Object.entries(game.periodBreakdown).map(([period, stats]) => (
                    <div key={period} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <h4 className="text-xl font-black text-slate-800 text-center mb-6 flex items-center justify-center space-x-2">
                        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg">{period}</span>
                        <span>Period {period}</span>
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-slate-600">Goals:</span>
                            <span className={`text-2xl font-black ${stats.goals_for > stats.goals_against ? 'text-green-600' : stats.goals_for < stats.goals_against ? 'text-red-600' : 'text-slate-800'}`}>
                              {stats.goals_for} - {stats.goals_against}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-slate-600">Shots:</span>
                            <span className="text-2xl font-black text-slate-800">{stats.for} - {stats.against}</span>
                          </div>
                        </div>
                        {/* Visual shot representation */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
                          <div className="flex justify-between text-sm font-bold text-slate-600 mb-3">
                            <span>Shots For</span>
                            <span>Shots Against</span>
                          </div>
                          <div className="flex h-8 rounded-full overflow-hidden border-2 border-slate-300 shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center" 
                              style={{ width: `${(stats.for / (stats.for + stats.against) * 100) || 50}%` }}
                            >
                              <span className="text-white text-sm font-black">{stats.for}</span>
                            </div>
                            <div 
                              className="bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center" 
                              style={{ width: `${(stats.against / (stats.for + stats.against) * 100) || 50}%` }}
                            >
                              <span className="text-white text-sm font-black">{stats.against}</span>
                            </div>
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-base font-black text-slate-700">Shot Share: {stats.for > 0 ? ((stats.for / (stats.for + stats.against)) * 100).toFixed(1) : '0.0'}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                  <p className="text-xl font-black text-slate-600">No period breakdown data available</p>
                </div>
              )}
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl p-10 shadow-xl border-2 border-slate-100">
              <h3 className="text-3xl font-black text-slate-800 mb-8 flex items-center space-x-3">
                <span className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center text-white text-2xl shadow-lg">📋</span>
                <span>Detailed Statistics</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="px-6 py-4 text-left text-base font-black text-slate-800 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-4 text-left text-base font-black text-slate-800 uppercase tracking-wider">Goals For</th>
                      <th className="px-6 py-4 text-left text-base font-black text-slate-800 uppercase tracking-wider">Goals Against</th>
                      <th className="px-6 py-4 text-left text-base font-black text-slate-800 uppercase tracking-wider">Shots For</th>
                      <th className="px-6 py-4 text-left text-base font-black text-slate-800 uppercase tracking-wider">Shots Against</th>
                      <th className="px-6 py-4 text-left text-base font-black text-slate-800 uppercase tracking-wider">Shot Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(game.periodBreakdown).map(([period, stats], index) => (
                      <tr key={period} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-slate-25' : 'bg-white'}`}>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-lg">{period}</span>
                            <span className="text-base font-black text-slate-800">Period {period}</span>
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
