/**
 * NHL Team Color Schemes
 * Authentic colors for all 32 NHL teams as of 2024-25 season
 */

export interface TeamColors {
  primary: string;
  secondary: string;
  accent?: string;
  text: {
    onPrimary: string;
    onSecondary: string;
    onAccent?: string;
  };
  gradient: string;
}

export const NHL_TEAM_COLORS: Record<string, TeamColors> = {
  // ATLANTIC DIVISION
  'BOS': { // Boston Bruins
    primary: '#FFB81C',
    secondary: '#000000',
    text: { onPrimary: '#000000', onSecondary: '#FFB81C' },
    gradient: 'linear-gradient(135deg, #FFB81C 0%, #000000 100%)'
  },
  'BUF': { // Buffalo Sabres
    primary: '#003087',
    secondary: '#FFB81C',
    text: { onPrimary: '#FFFFFF', onSecondary: '#003087' },
    gradient: 'linear-gradient(135deg, #003087 0%, #FFB81C 100%)'
  },
  'DET': { // Detroit Red Wings
    primary: '#CE1126',
    secondary: '#FFFFFF',
    text: { onPrimary: '#FFFFFF', onSecondary: '#CE1126' },
    gradient: 'linear-gradient(135deg, #CE1126 0%, #FFFFFF 100%)'
  },
  'FLA': { // Florida Panthers
    primary: '#041E42',
    secondary: '#C8102E',
    accent: '#B9975B',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onAccent: '#041E42' },
    gradient: 'linear-gradient(135deg, #041E42 0%, #C8102E 50%, #B9975B 100%)'
  },
  'MTL': { // Montreal Canadiens
    primary: '#AF1E2D',
    secondary: '#192168',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #AF1E2D 0%, #192168 100%)'
  },
  'OTT': { // Ottawa Senators
    primary: '#C8102E',
    secondary: '#000000',
    accent: '#CBA044',
    text: { onPrimary: '#FFFFFF', onSecondary: '#C8102E', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #C8102E 0%, #000000 50%, #CBA044 100%)'
  },
  'TBL': { // Tampa Bay Lightning
    primary: '#002868',
    secondary: '#FFFFFF',
    text: { onPrimary: '#FFFFFF', onSecondary: '#002868' },
    gradient: 'linear-gradient(135deg, #002868 0%, #FFFFFF 100%)'
  },
  'TOR': { // Toronto Maple Leafs
    primary: '#003E7E',
    secondary: '#FFFFFF',
    text: { onPrimary: '#FFFFFF', onSecondary: '#003E7E' },
    gradient: 'linear-gradient(135deg, #003E7E 0%, #FFFFFF 100%)'
  },

  // METROPOLITAN DIVISION
  'CAR': { // Carolina Hurricanes
    primary: '#CC0000',
    secondary: '#000000',
    text: { onPrimary: '#FFFFFF', onSecondary: '#CC0000' },
    gradient: 'linear-gradient(135deg, #CC0000 0%, #000000 100%)'
  },
  'CBJ': { // Columbus Blue Jackets
    primary: '#002654',
    secondary: '#CE1126',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #002654 0%, #CE1126 100%)'
  },
  'NJD': { // New Jersey Devils
    primary: '#CE1126',
    secondary: '#000000',
    text: { onPrimary: '#FFFFFF', onSecondary: '#CE1126' },
    gradient: 'linear-gradient(135deg, #CE1126 0%, #000000 100%)'
  },
  'NYI': { // New York Islanders
    primary: '#00539B',
    secondary: '#F47D30',
    text: { onPrimary: '#FFFFFF', onSecondary: '#000000' },
    gradient: 'linear-gradient(135deg, #00539B 0%, #F47D30 100%)'
  },
  'NYR': { // New York Rangers
    primary: '#0038A8',
    secondary: '#CE1126',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #0038A8 0%, #CE1126 100%)'
  },
  'PHI': { // Philadelphia Flyers
    primary: '#F74902',
    secondary: '#000000',
    text: { onPrimary: '#FFFFFF', onSecondary: '#F74902' },
    gradient: 'linear-gradient(135deg, #F74902 0%, #000000 100%)'
  },
  'PIT': { // Pittsburgh Penguins
    primary: '#000000',
    secondary: '#CFC493',
    accent: '#FCB514',
    text: { onPrimary: '#FCB514', onSecondary: '#000000', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #000000 0%, #CFC493 50%, #FCB514 100%)'
  },
  'WSH': { // Washington Capitals
    primary: '#041E42',
    secondary: '#C8102E',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #041E42 0%, #C8102E 100%)'
  },

  // CENTRAL DIVISION
  'ARI': { // Arizona Coyotes (now Utah Hockey Club)
    primary: '#8C2633',
    secondary: '#E2D6B5',
    accent: '#000000',
    text: { onPrimary: '#FFFFFF', onSecondary: '#8C2633', onAccent: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #8C2633 0%, #E2D6B5 50%, #000000 100%)'
  },
  'UTA': { // Utah Hockey Club
    primary: '#6CACE4',
    secondary: '#000000',
    text: { onPrimary: '#000000', onSecondary: '#6CACE4' },
    gradient: 'linear-gradient(135deg, #6CACE4 0%, #000000 100%)'
  },
  'CHI': { // Chicago Blackhawks
    primary: '#CF0A2C',
    secondary: '#000000',
    accent: '#FFD100',
    text: { onPrimary: '#FFFFFF', onSecondary: '#CF0A2C', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #CF0A2C 0%, #000000 50%, #FFD100 100%)'
  },
  'COL': { // Colorado Avalanche
    primary: '#6F263D',
    secondary: '#236192',
    accent: '#A2AAAD',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #6F263D 0%, #236192 50%, #A2AAAD 100%)'
  },
  'DAL': { // Dallas Stars
    primary: '#006847',
    secondary: '#000000',
    accent: '#8F8F8C',
    text: { onPrimary: '#FFFFFF', onSecondary: '#006847', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #006847 0%, #000000 50%, #8F8F8C 100%)'
  },
  'MIN': { // Minnesota Wild
    primary: '#A6192E',
    secondary: '#154734',
    accent: '#EAAA00',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #A6192E 0%, #154734 50%, #EAAA00 100%)'
  },
  'NSH': { // Nashville Predators
    primary: '#FFB81C',
    secondary: '#041E42',
    text: { onPrimary: '#041E42', onSecondary: '#FFB81C' },
    gradient: 'linear-gradient(135deg, #FFB81C 0%, #041E42 100%)'
  },
  'STL': { // St. Louis Blues
    primary: '#002F87',
    secondary: '#FCB514',
    text: { onPrimary: '#FFFFFF', onSecondary: '#002F87' },
    gradient: 'linear-gradient(135deg, #002F87 0%, #FCB514 100%)'
  },
  'WPG': { // Winnipeg Jets
    primary: '#041E42',
    secondary: '#004C97',
    accent: '#AC162C',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onAccent: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #041E42 0%, #004C97 50%, #AC162C 100%)'
  },

  // PACIFIC DIVISION
  'ANA': { // Anaheim Ducks
    primary: '#F47A38',
    secondary: '#B9975B',
    accent: '#C1C6C8',
    text: { onPrimary: '#000000', onSecondary: '#000000', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #F47A38 0%, #B9975B 50%, #C1C6C8 100%)'
  },
  'CGY': { // Calgary Flames
    primary: '#C8102E',
    secondary: '#F1BE48',
    accent: '#000000',
    text: { onPrimary: '#FFFFFF', onSecondary: '#000000', onAccent: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #C8102E 0%, #F1BE48 50%, #000000 100%)'
  },
  'EDM': { // Edmonton Oilers
    primary: '#041E42',
    secondary: '#FF4C00',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #041E42 0%, #FF4C00 100%)'
  },
  'LAK': { // Los Angeles Kings
    primary: '#111111',
    secondary: '#A2AAAD',
    text: { onPrimary: '#FFFFFF', onSecondary: '#111111' },
    gradient: 'linear-gradient(135deg, #111111 0%, #A2AAAD 100%)'
  },
  'SJS': { // San Jose Sharks
    primary: '#006D75',
    secondary: '#EA7200',
    accent: '#000000',
    text: { onPrimary: '#FFFFFF', onSecondary: '#000000', onAccent: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #006D75 0%, #EA7200 50%, #000000 100%)'
  },
  'SEA': { // Seattle Kraken
    primary: '#001628',
    secondary: '#99D9D9',
    accent: '#355464',
    text: { onPrimary: '#99D9D9', onSecondary: '#001628', onAccent: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #001628 0%, #99D9D9 50%, #355464 100%)'
  },
  'VAN': { // Vancouver Canucks
    primary: '#001F5B',
    secondary: '#00205B',
    accent: '#97999B',
    text: { onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onAccent: '#000000' },
    gradient: 'linear-gradient(135deg, #001F5B 0%, #00205B 50%, #97999B 100%)'
  },
  'VGK': { // Vegas Golden Knights
    primary: '#B4975A',
    secondary: '#333F42',
    accent: '#C8102E',
    text: { onPrimary: '#000000', onSecondary: '#B4975A', onAccent: '#FFFFFF' },
    gradient: 'linear-gradient(135deg, #B4975A 0%, #333F42 50%, #C8102E 100%)'
  }
};

/**
 * Get team colors by team abbreviation
 */
export const getTeamColors = (teamAbbr: string): TeamColors => {
  const colors = NHL_TEAM_COLORS[teamAbbr.toUpperCase()];
  if (!colors) {
    // Default fallback colors
    return {
      primary: '#003366',
      secondary: '#FFFFFF',
      text: { onPrimary: '#FFFFFF', onSecondary: '#003366' },
      gradient: 'linear-gradient(135deg, #003366 0%, #FFFFFF 100%)'
    };
  }
  return colors;
};

/**
 * Generate CSS custom properties for a team
 */
export const getTeamCSSVariables = (teamAbbr: string): Record<string, string> => {
  const colors = getTeamColors(teamAbbr);
  return {
    '--team-primary': colors.primary,
    '--team-secondary': colors.secondary,
    '--team-accent': colors.accent || colors.secondary,
    '--team-text-primary': colors.text.onPrimary,
    '--team-text-secondary': colors.text.onSecondary,
    '--team-text-accent': colors.text.onAccent || colors.text.onSecondary,
    '--team-gradient': colors.gradient,
  };
};

/**
 * Get contrasting text color for a given background
 */
export const getContrastColor = (backgroundColor: string, teamColors: TeamColors): string => {
  if (backgroundColor === teamColors.primary) return teamColors.text.onPrimary;
  if (backgroundColor === teamColors.secondary) return teamColors.text.onSecondary;
  if (backgroundColor === teamColors.accent) return teamColors.text.onAccent || teamColors.text.onSecondary;
  return '#000000'; // Default fallback
};

/**
 * Check if team abbreviation is valid
 */
export const isValidTeam = (teamAbbr: string): boolean => {
  return teamAbbr.toUpperCase() in NHL_TEAM_COLORS;
};

/**
 * Get all team abbreviations
 */
export const getAllTeamAbbreviations = (): string[] => {
  return Object.keys(NHL_TEAM_COLORS).sort();
};
