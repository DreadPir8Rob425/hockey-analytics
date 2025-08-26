/**
 * Hockey Statistics Glossary
 * Comprehensive explanations of hockey analytics terms and metrics
 */

export interface StatDefinition {
  name: string;
  shortName: string;
  category: 'basic' | 'advanced' | 'situational' | 'goaltending';
  definition: string;
  explanation: string;
  calculation?: string;
  goodRange?: string;
  interpretation: {
    high: string;
    average: string;
    low: string;
  };
  examples?: string[];
  relatedStats?: string[];
}

export const HOCKEY_STATS_GLOSSARY: Record<string, StatDefinition> = {
  // BASIC STATISTICS
  'goals': {
    name: 'Goals',
    shortName: 'G',
    category: 'basic',
    definition: 'The number of goals scored by a team or player.',
    explanation: 'Goals are the primary objective in hockey - putting the puck in the opponent\'s net. This is the most fundamental statistic.',
    interpretation: {
      high: 'Strong offensive performance',
      average: 'Typical scoring output',
      low: 'Struggling to generate offense'
    },
    examples: ['3 goals in a game is above average', 'Elite teams average 3+ goals per game'],
    relatedStats: ['shots', 'shooting_percentage', 'expected_goals']
  },

  'shots': {
    name: 'Shots on Goal',
    shortName: 'SOG',
    category: 'basic',
    definition: 'Shots that are directed toward the goal and would go in if not for the goaltender or a goal post/crossbar.',
    explanation: 'Shots on goal indicate offensive pressure and puck possession. More shots generally lead to more goals.',
    interpretation: {
      high: 'Dominating offensive zone time',
      average: 'Balanced shot generation',
      low: 'Limited offensive opportunities'
    },
    goodRange: '30+ shots per game is considered good',
    examples: ['35 shots in a game shows strong offensive pressure'],
    relatedStats: ['goals', 'shooting_percentage', 'corsi']
  },

  'shooting_percentage': {
    name: 'Shooting Percentage',
    shortName: 'SH%',
    category: 'basic',
    definition: 'The percentage of shots on goal that result in a goal.',
    explanation: 'Shooting percentage measures finishing ability. It can indicate skill level, luck, or shot quality.',
    calculation: 'Goals ÷ Shots on Goal × 100',
    goodRange: '8-12% is typical for teams',
    interpretation: {
      high: 'Excellent finishing or unsustainable hot streak',
      average: 'Normal conversion rate',
      low: 'Poor finishing or bad luck'
    },
    examples: ['10% shooting means 1 goal for every 10 shots'],
    relatedStats: ['goals', 'shots', 'expected_goals']
  },

  'save_percentage': {
    name: 'Save Percentage',
    shortName: 'SV%',
    category: 'goaltending',
    definition: 'The percentage of shots on goal that the goaltender saves.',
    explanation: 'Save percentage measures goaltending performance. Higher percentages indicate better goaltending.',
    calculation: 'Saves ÷ Shots Against × 100',
    goodRange: '90%+ is good, 92%+ is excellent',
    interpretation: {
      high: 'Elite goaltending performance (92%+)',
      average: 'Average goaltending (90-92%)',
      low: 'Poor goaltending or defensive breakdowns (<90%)'
    },
    examples: ['.915 save percentage means saving 91.5% of shots faced'],
    relatedStats: ['goals_against', 'shots_against']
  },

  // ADVANCED STATISTICS
  'corsi': {
    name: 'Corsi Percentage',
    shortName: 'CF%',
    category: 'advanced',
    definition: 'The percentage of all shot attempts (shots on goal, missed shots, and blocked shots) taken by a team.',
    explanation: 'Corsi measures puck possession and territorial control. Teams with higher Corsi typically control play and create more scoring chances.',
    calculation: 'Shot Attempts For ÷ (Shot Attempts For + Shot Attempts Against) × 100',
    goodRange: '50%+ indicates good puck possession',
    interpretation: {
      high: 'Dominating puck possession and zone time',
      average: 'Even puck possession battle',
      low: 'Being outplayed and spending too much time defending'
    },
    examples: ['55% Corsi means taking 55% of all shot attempts in the game'],
    relatedStats: ['fenwick', 'shots', 'expected_goals']
  },

  'fenwick': {
    name: 'Fenwick Percentage',
    shortName: 'FF%',
    category: 'advanced',
    definition: 'Similar to Corsi, but excludes blocked shots. Measures unblocked shot attempts.',
    explanation: 'Fenwick removes the element of shot blocking, focusing on shot attempts that actually reach the goal area. Some analysts prefer it over Corsi.',
    calculation: 'Unblocked Shot Attempts For ÷ (Unblocked Shot Attempts For + Against) × 100',
    goodRange: '50%+ indicates good offensive pressure',
    interpretation: {
      high: 'Generating quality shot attempts and avoiding blocks',
      average: 'Even shot attempt battle',
      low: 'Struggling to generate clean shot attempts'
    },
    examples: ['52% Fenwick means generating 52% of unblocked shot attempts'],
    relatedStats: ['corsi', 'shots', 'expected_goals']
  },

  'expected_goals': {
    name: 'Expected Goals',
    shortName: 'xG',
    category: 'advanced',
    definition: 'A metric that estimates how many goals a team should have scored based on shot quality and location.',
    explanation: 'Expected goals considers factors like shot distance, angle, and situation to predict scoring probability. It helps identify if results match performance.',
    goodRange: 'Compare to actual goals to assess performance',
    interpretation: {
      high: 'Creating high-quality scoring chances',
      average: 'Generating typical scoring opportunities',
      low: 'Limited or poor-quality scoring chances'
    },
    examples: ['2.5 xG suggests the team should have scored about 2-3 goals'],
    relatedStats: ['goals', 'shots', 'shooting_percentage']
  },

  'pdo': {
    name: 'PDO',
    shortName: 'PDO',
    category: 'advanced',
    definition: 'The sum of a team\'s shooting percentage and save percentage at even strength.',
    explanation: 'PDO measures luck and sustainability. Values significantly above or below 100 typically regress toward the mean over time.',
    calculation: 'Shooting Percentage + Save Percentage (at even strength)',
    goodRange: '98-102 is normal range',
    interpretation: {
      high: 'Likely experiencing good luck, may regress',
      average: 'Sustainable performance level',
      low: 'Likely experiencing bad luck, may improve'
    },
    examples: ['PDO of 105 suggests unsustainably good luck', 'PDO of 95 suggests bad luck that should improve'],
    relatedStats: ['shooting_percentage', 'save_percentage']
  },

  'face_off_percentage': {
    name: 'Faceoff Win Percentage',
    shortName: 'FO%',
    category: 'basic',
    definition: 'The percentage of faceoffs won by a team or player.',
    explanation: 'Faceoff wins provide puck possession to start plays. Important in all zones, especially crucial situations.',
    calculation: 'Faceoffs Won ÷ Total Faceoffs × 100',
    goodRange: '50%+ is good, 55%+ is excellent',
    interpretation: {
      high: 'Excellent faceoff performance, gaining extra possessions',
      average: 'Even in the faceoff circle',
      low: 'Struggling to win draws, losing valuable possessions'
    },
    examples: ['60% faceoff percentage means winning 6 out of every 10 draws'],
    relatedStats: ['possession_time']
  },

  'hits': {
    name: 'Hits',
    shortName: 'HIT',
    category: 'basic',
    definition: 'Legal body checks delivered by a player or team.',
    explanation: 'Hits indicate physical play and defensive pressure. Can wear down opponents but sometimes means chasing the play.',
    interpretation: {
      high: 'Very physical game, possibly chasing the puck',
      average: 'Normal physical engagement',
      low: 'Limited physical contact, possibly controlling play'
    },
    examples: ['25+ hits in a game indicates very physical play'],
    relatedStats: ['penalties']
  },

  'penalties': {
    name: 'Penalty Minutes',
    shortName: 'PIM',
    category: 'basic',
    definition: 'Total minutes assessed in penalties to a team or player.',
    explanation: 'Penalties result in short-handed situations. Teams want to minimize penalties while drawing them from opponents.',
    interpretation: {
      high: 'Undisciplined play, giving opponents power play opportunities',
      average: 'Normal penalty levels',
      low: 'Disciplined play, staying out of penalty box'
    },
    examples: ['6+ penalty minutes can significantly impact a game'],
    relatedStats: ['power_play', 'penalty_kill']
  },

  // SITUATIONAL STATISTICS
  '5on5': {
    name: 'Even Strength (5-on-5)',
    shortName: '5v5',
    category: 'situational',
    definition: 'Statistics recorded when both teams have 5 skaters plus a goaltender on the ice.',
    explanation: 'Even strength represents the majority of game time. Performance here is most indicative of team strength.',
    interpretation: {
      high: 'Strong even-strength play',
      average: 'Competitive even-strength performance',
      low: 'Struggling at even strength'
    },
    examples: ['About 75-85% of game time is spent at even strength'],
    relatedStats: ['power_play', 'penalty_kill']
  },

  '5on4': {
    name: 'Power Play (5-on-4)',
    shortName: 'PP',
    category: 'situational',
    definition: 'Statistics when a team has a one-player advantage due to an opponent\'s penalty.',
    explanation: 'Power plays are crucial scoring opportunities. Good teams capitalize on these advantages.',
    goodRange: '20%+ power play percentage is good',
    interpretation: {
      high: 'Excellent power play execution',
      average: 'Average special teams performance',
      low: 'Struggling to capitalize on advantages'
    },
    examples: ['Teams typically score on 15-25% of power play opportunities'],
    relatedStats: ['penalties_drawn', 'goals']
  },

  '4on5': {
    name: 'Penalty Kill (4-on-5)',
    shortName: 'PK',
    category: 'situational',
    definition: 'Statistics when a team is short-handed due to a penalty.',
    explanation: 'Penalty killing prevents opponents from scoring on power plays. Critical for team success.',
    goodRange: '80%+ penalty kill percentage is good',
    interpretation: {
      high: 'Excellent penalty killing',
      average: 'Average special teams defense',
      low: 'Struggling short-handed, allowing too many goals'
    },
    examples: ['Good teams kill 80-85% of penalties'],
    relatedStats: ['penalties_taken', 'goals_against']
  }
};

/**
 * Get definition for a specific statistic
 */
export const getStatDefinition = (statKey: string): StatDefinition | undefined => {
  return HOCKEY_STATS_GLOSSARY[statKey.toLowerCase()];
};

/**
 * Get all statistics by category
 */
export const getStatsByCategory = (category: StatDefinition['category']): Record<string, StatDefinition> => {
  return Object.entries(HOCKEY_STATS_GLOSSARY)
    .filter(([_, stat]) => stat.category === category)
    .reduce((acc, [key, stat]) => ({ ...acc, [key]: stat }), {});
};

/**
 * Search statistics by name or definition
 */
export const searchStats = (query: string): Record<string, StatDefinition> => {
  const searchTerm = query.toLowerCase();
  return Object.entries(HOCKEY_STATS_GLOSSARY)
    .filter(([key, stat]) => 
      key.includes(searchTerm) ||
      stat.name.toLowerCase().includes(searchTerm) ||
      stat.shortName.toLowerCase().includes(searchTerm) ||
      stat.definition.toLowerCase().includes(searchTerm)
    )
    .reduce((acc, [key, stat]) => ({ ...acc, [key]: stat }), {});
};
