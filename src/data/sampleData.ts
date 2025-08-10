import { Player, PlayerStats, Team, TeamStats, Game } from "@/types/hockey";

// Sample players data
export const samplePlayers: Player[] = [
  {
    id: "mcdavid-connor",
    name: "Connor McDavid",
    position: "C",
    team: "Edmonton Oilers",
    jerseyNumber: 97,
    age: 27,
    height: "6'1\"",
    weight: 193,
    shoots: "L"
  },
  {
    id: "draisaitl-leon",
    name: "Leon Draisaitl",
    position: "C",
    team: "Edmonton Oilers",
    jerseyNumber: 29,
    age: 28,
    height: "6'2\"",
    weight: 208,
    shoots: "L"
  },
  {
    id: "mackinnon-nathan",
    name: "Nathan MacKinnon",
    position: "C",
    team: "Colorado Avalanche",
    jerseyNumber: 29,
    age: 29,
    height: "6'0\"",
    weight: 200,
    shoots: "R"
  },
  {
    id: "pastrnak-david",
    name: "David Pastrnak",
    position: "RW",
    team: "Boston Bruins",
    jerseyNumber: 88,
    age: 28,
    height: "6'0\"",
    weight: 194,
    shoots: "R"
  },
  {
    id: "matthews-auston",
    name: "Auston Matthews",
    position: "C",
    team: "Toronto Maple Leafs",
    jerseyNumber: 34,
    age: 27,
    height: "6'3\"",
    weight: 220,
    shoots: "L"
  }
];

// Sample player stats
export const samplePlayerStats: PlayerStats[] = [
  {
    playerId: "mcdavid-connor",
    season: "2023-24",
    gamesPlayed: 76,
    goals: 42,
    assists: 58,
    points: 100,
    plusMinus: 15,
    penaltyMinutes: 22,
    powerPlayGoals: 15,
    powerPlayAssists: 24,
    shortHandedGoals: 1,
    shortHandedAssists: 2,
    gameWinningGoals: 8,
    shots: 285,
    shotPercentage: 14.7,
    timeOnIcePerGame: "22:18",
    faceoffWinPercentage: 53.2
  },
  {
    playerId: "draisaitl-leon",
    season: "2023-24",
    gamesPlayed: 78,
    goals: 38,
    assists: 52,
    points: 90,
    plusMinus: 12,
    penaltyMinutes: 18,
    powerPlayGoals: 12,
    powerPlayAssists: 28,
    shortHandedGoals: 0,
    shortHandedAssists: 1,
    gameWinningGoals: 6,
    shots: 268,
    shotPercentage: 14.2,
    timeOnIcePerGame: "21:45",
    faceoffWinPercentage: 55.8
  },
  {
    playerId: "mackinnon-nathan",
    season: "2023-24",
    gamesPlayed: 82,
    goals: 35,
    assists: 48,
    points: 83,
    plusMinus: 18,
    penaltyMinutes: 26,
    powerPlayGoals: 11,
    powerPlayAssists: 18,
    shortHandedGoals: 2,
    shortHandedAssists: 0,
    gameWinningGoals: 7,
    shots: 295,
    shotPercentage: 11.9,
    timeOnIcePerGame: "20:58",
    faceoffWinPercentage: 48.6
  },
  {
    playerId: "pastrnak-david",
    season: "2023-24",
    gamesPlayed: 82,
    goals: 45,
    assists: 35,
    points: 80,
    plusMinus: 8,
    penaltyMinutes: 32,
    powerPlayGoals: 18,
    powerPlayAssists: 15,
    shortHandedGoals: 0,
    shortHandedAssists: 1,
    gameWinningGoals: 9,
    shots: 312,
    shotPercentage: 14.4,
    timeOnIcePerGame: "19:42",
    faceoffWinPercentage: 47.2
  },
  {
    playerId: "matthews-auston",
    season: "2023-24",
    gamesPlayed: 74,
    goals: 41,
    assists: 36,
    points: 77,
    plusMinus: 5,
    penaltyMinutes: 14,
    powerPlayGoals: 16,
    powerPlayAssists: 12,
    shortHandedGoals: 1,
    shortHandedAssists: 0,
    gameWinningGoals: 8,
    shots: 289,
    shotPercentage: 14.2,
    timeOnIcePerGame: "20:28",
    faceoffWinPercentage: 51.3
  }
];

// Sample teams
export const sampleTeams: Team[] = [
  {
    id: "edm",
    name: "Oilers",
    city: "Edmonton",
    abbreviation: "EDM",
    conference: "Western",
    division: "Pacific",
    foundedYear: 1972,
    primaryColor: "#FF4C00",
    secondaryColor: "#041E42",
    logo: "/logos/edm.png"
  },
  {
    id: "tor",
    name: "Maple Leafs",
    city: "Toronto",
    abbreviation: "TOR",
    conference: "Eastern",
    division: "Atlantic",
    foundedYear: 1917,
    primaryColor: "#003E7E",
    secondaryColor: "#FFFFFF",
    logo: "/logos/tor.png"
  },
  {
    id: "col",
    name: "Avalanche",
    city: "Colorado",
    abbreviation: "COL",
    conference: "Western",
    division: "Central",
    foundedYear: 1972,
    primaryColor: "#6F263D",
    secondaryColor: "#236192",
    logo: "/logos/col.png"
  },
  {
    id: "bos",
    name: "Bruins",
    city: "Boston",
    abbreviation: "BOS",
    conference: "Eastern",
    division: "Atlantic",
    foundedYear: 1924,
    primaryColor: "#FFB81C",
    secondaryColor: "#000000",
    logo: "/logos/bos.png"
  }
];

// Sample team stats
export const sampleTeamStats: TeamStats[] = [
  {
    teamId: "edm",
    season: "2023-24",
    gamesPlayed: 82,
    wins: 49,
    losses: 27,
    overtimeLosses: 6,
    points: 104,
    pointPercentage: 63.4,
    goalsFor: 285,
    goalsAgainst: 220,
    goalDifferential: 65,
    powerPlayPercentage: 22.5,
    penaltyKillPercentage: 84.2,
    shotsFor: 2634,
    shotsAgainst: 2456,
    faceoffWinPercentage: 52.3
  },
  {
    teamId: "tor",
    season: "2023-24",
    gamesPlayed: 82,
    wins: 46,
    losses: 26,
    overtimeLosses: 10,
    points: 102,
    pointPercentage: 62.2,
    goalsFor: 268,
    goalsAgainst: 235,
    goalDifferential: 33,
    powerPlayPercentage: 19.8,
    penaltyKillPercentage: 82.1,
    shotsFor: 2502,
    shotsAgainst: 2578,
    faceoffWinPercentage: 48.7
  },
  {
    teamId: "col",
    season: "2023-24",
    gamesPlayed: 82,
    wins: 50,
    losses: 25,
    overtimeLosses: 7,
    points: 107,
    pointPercentage: 65.2,
    goalsFor: 295,
    goalsAgainst: 218,
    goalDifferential: 77,
    powerPlayPercentage: 25.1,
    penaltyKillPercentage: 85.6,
    shotsFor: 2689,
    shotsAgainst: 2387,
    faceoffWinPercentage: 49.2
  },
  {
    teamId: "bos",
    season: "2023-24",
    gamesPlayed: 82,
    wins: 47,
    losses: 20,
    overtimeLosses: 15,
    points: 109,
    pointPercentage: 66.5,
    goalsFor: 278,
    goalsAgainst: 201,
    goalDifferential: 77,
    powerPlayPercentage: 20.2,
    penaltyKillPercentage: 86.8,
    shotsFor: 2456,
    shotsAgainst: 2234,
    faceoffWinPercentage: 51.8
  }
];

// Sample games
export const sampleGames: Game[] = [
  {
    id: "game-001",
    date: new Date("2024-01-15"),
    homeTeam: "Edmonton Oilers",
    awayTeam: "Toronto Maple Leafs",
    homeScore: 4,
    awayScore: 2,
    period: 3,
    timeRemaining: "00:00",
    status: "final",
    venue: "Rogers Place",
    attendance: 18347
  },
  {
    id: "game-002",
    date: new Date("2024-01-16"),
    homeTeam: "Boston Bruins",
    awayTeam: "Colorado Avalanche",
    homeScore: 3,
    awayScore: 5,
    period: 3,
    timeRemaining: "00:00",
    status: "final",
    venue: "TD Garden",
    attendance: 17850
  }
];

// Sample chart data for trends
export const sampleTrendsData = [
  { month: "Oct", goalsPerGame: 3.1, assistsPerGame: 4.2, totalGames: 124 },
  { month: "Nov", goalsPerGame: 3.3, assistsPerGame: 4.5, totalGames: 156 },
  { month: "Dec", goalsPerGame: 3.2, assistsPerGame: 4.3, totalGames: 142 },
  { month: "Jan", goalsPerGame: 3.4, assistsPerGame: 4.6, totalGames: 168 },
  { month: "Feb", goalsPerGame: 3.0, assistsPerGame: 4.1, totalGames: 134 },
  { month: "Mar", goalsPerGame: 3.5, assistsPerGame: 4.8, totalGames: 175 },
  { month: "Apr", goalsPerGame: 3.3, assistsPerGame: 4.4, totalGames: 158 }
];

// Mock API functions
export const mockApi = {
  async getPlayers(): Promise<Player[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return samplePlayers;
  },

  async getPlayerStats(season = "2023-24"): Promise<PlayerStats[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return samplePlayerStats.filter(stat => stat.season === season);
  },

  async getTeams(): Promise<Team[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return sampleTeams;
  },

  async getTeamStats(season = "2023-24"): Promise<TeamStats[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return sampleTeamStats.filter(stat => stat.season === season);
  },

  async getGames(startDate?: Date, endDate?: Date): Promise<Game[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    let games = sampleGames;
    
    if (startDate) {
      games = games.filter(game => game.date >= startDate);
    }
    
    if (endDate) {
      games = games.filter(game => game.date <= endDate);
    }
    
    return games;
  },

  async getDashboardData(): Promise<{
    totalGames: number;
    totalPlayers: number;
    totalTeams: number;
    avgGoalsPerGame: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      totalGames: 1247,
      totalPlayers: 890,
      totalTeams: 32,
      avgGoalsPerGame: 3.2
    };
  }
};
