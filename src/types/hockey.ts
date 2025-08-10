// Player types
export interface Player {
  id: string;
  name: string;
  position: 'C' | 'LW' | 'RW' | 'D' | 'G';
  team: string;
  jerseyNumber: number;
  age: number;
  height: string;
  weight: number;
  shoots: 'L' | 'R';
}

export interface PlayerStats {
  playerId: string;
  season: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  powerPlayGoals: number;
  powerPlayAssists: number;
  shortHandedGoals: number;
  shortHandedAssists: number;
  gameWinningGoals: number;
  shots: number;
  shotPercentage: number;
  timeOnIcePerGame: string;
  faceoffWinPercentage?: number; // Only for forwards
  hits?: number;
  blocked?: number;
}

// Team types
export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  conference: 'Eastern' | 'Western';
  division: string;
  foundedYear: number;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

export interface TeamStats {
  teamId: string;
  season: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  overtimeLosses: number;
  points: number;
  pointPercentage: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifferential: number;
  powerPlayPercentage: number;
  penaltyKillPercentage: number;
  shotsFor: number;
  shotsAgainst: number;
  faceoffWinPercentage: number;
}

// Game types
export interface Game {
  id: string;
  date: Date;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  period: number;
  timeRemaining: string;
  status: 'scheduled' | 'live' | 'final' | 'postponed';
  venue: string;
  attendance?: number;
}

export interface GameEvent {
  id: string;
  gameId: string;
  period: number;
  time: string;
  type: 'goal' | 'assist' | 'penalty' | 'hit' | 'shot' | 'save' | 'faceoff';
  playerId: string;
  teamId: string;
  description: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

// Analytics types
export interface PlayerAnalytics extends PlayerStats {
  advancedStats: {
    corsiFor: number;
    corsiAgainst: number;
    corsiPercentage: number;
    fenwickFor: number;
    fenwickAgainst: number;
    fenwickPercentage: number;
    pdo: number;
    oiSave: number;
    oiShoot: number;
    relativeCorsi: number;
  };
}

export interface TeamAnalytics extends TeamStats {
  advancedStats: {
    corsiFor: number;
    corsiAgainst: number;
    corsiPercentage: number;
    fenwickFor: number;
    fenwickAgainst: number;
    fenwickPercentage: number;
    pdo: number;
    savePercentage: number;
    shootingPercentage: number;
    expectedGoalsFor: number;
    expectedGoalsAgainst: number;
  };
}

// Chart data types
export interface ChartData {
  [key: string]: string | number;
}

export interface TrendData {
  date: string;
  value: number;
  category?: string;
}

export interface ComparisonData {
  category: string;
  [key: string]: string | number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface DashboardData {
  totalGames: number;
  totalPlayers: number;
  totalTeams: number;
  avgGoalsPerGame: number;
  topPlayers: PlayerStats[];
  teamComparisons: TeamStats[];
  gamesTrends: TrendData[];
}
