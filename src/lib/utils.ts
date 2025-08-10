import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PlayerStats, TeamStats } from "@/types/hockey";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hockey-specific utility functions

/**
 * Calculate points (goals + assists) for a player
 */
export function calculatePoints(goals: number, assists: number): number {
  return goals + assists;
}

/**
 * Calculate team point percentage
 */
export function calculatePointPercentage(points: number, gamesPlayed: number): number {
  const maxPossiblePoints = gamesPlayed * 2; // 2 points per game maximum
  return maxPossiblePoints > 0 ? (points / maxPossiblePoints) * 100 : 0;
}

/**
 * Calculate shooting percentage
 */
export function calculateShootingPercentage(goals: number, shots: number): number {
  return shots > 0 ? (goals / shots) * 100 : 0;
}

/**
 * Calculate save percentage
 */
export function calculateSavePercentage(saves: number, shotsAgainst: number): number {
  return shotsAgainst > 0 ? (saves / shotsAgainst) * 100 : 0;
}

/**
 * Calculate goals per game
 */
export function calculateGoalsPerGame(goals: number, gamesPlayed: number): number {
  return gamesPlayed > 0 ? goals / gamesPlayed : 0;
}

/**
 * Calculate assists per game
 */
export function calculateAssistsPerGame(assists: number, gamesPlayed: number): number {
  return gamesPlayed > 0 ? assists / gamesPlayed : 0;
}

/**
 * Calculate points per game
 */
export function calculatePointsPerGame(points: number, gamesPlayed: number): number {
  return gamesPlayed > 0 ? points / gamesPlayed : 0;
}

/**
 * Format time on ice (convert minutes to MM:SS format)
 */
export function formatTimeOnIce(totalMinutes: number): string {
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.floor((totalMinutes - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Convert MM:SS format to total minutes
 */
export function parseTimeOnIce(timeString: string): number {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes + (seconds || 0) / 60;
}

/**
 * Calculate team winning percentage
 */
export function calculateWinningPercentage(wins: number, gamesPlayed: number): number {
  return gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0;
}

/**
 * Sort players by points (descending)
 */
export function sortPlayersByPoints(players: PlayerStats[]): PlayerStats[] {
  return [...players].sort((a, b) => b.points - a.points);
}

/**
 * Sort teams by points (descending)
 */
export function sortTeamsByPoints(teams: TeamStats[]): TeamStats[] {
  return [...teams].sort((a, b) => b.points - a.points);
}

/**
 * Get player position full name
 */
export function getPositionFullName(position: string): string {
  const positions: Record<string, string> = {
    'C': 'Center',
    'LW': 'Left Wing',
    'RW': 'Right Wing',
    'D': 'Defense',
    'G': 'Goalie'
  };
  return positions[position] || position;
}

/**
 * Calculate goal differential for a team
 */
export function calculateGoalDifferential(goalsFor: number, goalsAgainst: number): number {
  return goalsFor - goalsAgainst;
}

/**
 * Determine if a team made the playoffs based on point percentage
 */
export function isPlayoffTeam(pointPercentage: number): boolean {
  return pointPercentage >= 56.25; // Roughly 92 points in 82 games
}

/**
 * Calculate Corsi percentage
 */
export function calculateCorsiPercentage(corsiFor: number, corsiAgainst: number): number {
  const totalCorsi = corsiFor + corsiAgainst;
  return totalCorsi > 0 ? (corsiFor / totalCorsi) * 100 : 0;
}

/**
 * Calculate Fenwick percentage
 */
export function calculateFenwickPercentage(fenwickFor: number, fenwickAgainst: number): number {
  const totalFenwick = fenwickFor + fenwickAgainst;
  return totalFenwick > 0 ? (fenwickFor / totalFenwick) * 100 : 0;
}

/**
 * Calculate PDO (Shooting% + Save%)
 */
export function calculatePDO(shootingPercentage: number, savePercentage: number): number {
  return shootingPercentage + savePercentage;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format percentage to specified decimal places
 */
export function formatPercentage(percentage: number, decimals: number = 1): string {
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Generate color palette for charts
 */
export function generateColorPalette(count: number): string[] {
  const baseColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // If we need more colors, generate variations
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const baseIndex = i % baseColors.length;
    const lightness = 50 + (Math.floor(i / baseColors.length) * 20);
    colors.push(`hsl(${baseIndex * 36}, 70%, ${Math.min(lightness, 90)}%)`);
  }
  
  return colors;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
