import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  console.error('Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;

    // Get all data for this specific game_id
    const { data: gameData, error } = await supabase
      .from('games')
      .select('*')
      .eq('game_id', gameId)
      .order('situation');

    if (error) {
      console.error('Supabase error fetching game details:', error);
      return NextResponse.json(
        { error: 'Failed to fetch game details', details: error.message },
        { status: 500 }
      );
    }

    if (!gameData || gameData.length === 0) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Get related shot data for this game
    const { data: shotData, error: shotError } = await supabase
      .from('nhl_shots_2024')
      .select(`
        shot_id,
        team_code,
        event,
        goal,
        shot_type,
        shot_distance,
        shot_angle,
        x_goal,
        x_shot_was_on_goal,
        period,
        time,
        shooter_name,
        goalie_name_for_shot,
        home_team_code,
        away_team_code,
        x_cord,
        y_cord,
        location
      `)
      .eq('game_id', parseInt(gameId))
      .order('period')
      .order('time');

    if (shotError) {
      console.warn('Error fetching shot data:', shotError);
    }

    // Group game data by situation
    const situations = gameData.reduce((acc, game) => {
      acc[game.situation] = game;
      return acc;
    }, {} as Record<string, any>);

    // Calculate additional analytics
    const allSituations = situations['all'] || {};
    const evenStrength = situations['5on5'] || {};
    const powerPlay = situations['5on4'] || {};
    const penaltyKill = situations['4on5'] || {};

    // Calculate shooting percentages
    const shootingPercentage = allSituations.shots_on_goal_for > 0 
      ? (allSituations.goals_for / allSituations.shots_on_goal_for * 100)
      : 0;

    const savePercentage = allSituations.shots_on_goal_against > 0
      ? ((allSituations.shots_on_goal_against - allSituations.goals_against) / allSituations.shots_on_goal_against * 100)
      : 0;

    // Calculate PDO
    const pdo = shootingPercentage + savePercentage;

    // Calculate expected goals differential
    const xgDifferential = allSituations.x_goals_for - allSituations.x_goals_against;
    const actualDifferential = allSituations.goals_for - allSituations.goals_against;

    // Group shots by period and team
    const shotsByPeriod = shotData?.reduce((acc, shot) => {
      const period = shot.period;
      if (!acc[period]) {
        acc[period] = { for: 0, against: 0, goals_for: 0, goals_against: 0 };
      }
      
      // Determine if shot is for or against the team
      const gameTeam = allSituations.team;
      if (shot.team_code === gameTeam) {
        acc[period].for++;
        if (shot.goal) acc[period].goals_for++;
      } else {
        acc[period].against++;
        if (shot.goal) acc[period].goals_against++;
      }
      
      return acc;
    }, {} as Record<number, any>) || {};

    console.log(`Game Details API: Found game ${gameId} with ${gameData.length} situations`);
    
    return NextResponse.json({
      game: {
        ...allSituations,
        situations,
        analytics: {
          shootingPercentage: shootingPercentage.toFixed(1),
          savePercentage: savePercentage.toFixed(1),
          pdo: pdo.toFixed(1),
          xgDifferential: xgDifferential.toFixed(2),
          actualDifferential: actualDifferential,
          xgOutperformance: (actualDifferential - xgDifferential).toFixed(2)
        },
        periodBreakdown: shotsByPeriod,
        shots: shotData || []
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
