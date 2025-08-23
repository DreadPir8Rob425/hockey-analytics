import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export interface ShotFilters {
  teams?: string[];
  players?: string[];
  periods?: number[];
  shotTypes?: string[];
  xGoalMin?: number;
  xGoalMax?: number;
  minDistance?: number;
  maxDistance?: number;
  homeTeam?: string;
  awayTeam?: string;
  season?: string;
  gameId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  shotResult?: 'goal' | 'shot' | 'miss' | 'block';
  situationCode?: 'even' | 'powerplay' | 'shorthanded' | 'emptynet';
  limit?: number;
  offset?: number;
}

export interface ShotData {
  shot_id: string;
  x_cord: number;
  y_cord: number;
  x_goal: number;
  shooter_name: string;
  team_code: string;
  home_team_code: string;
  away_team_code: string;
  period: number;
  shot_type: string;
  shot_distance: number;
  shot_angle: number;
  shot_was_on_goal: boolean;
  shot_goal_probability: number;
  time_left: number;
  game_id: string;
  is_home_team: boolean;
  home_skaters_on_ice: number;
  away_skaters_on_ice: number;
  shot_on_empty_net: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured', data: [], count: 0, totalCount: 0 },
        { status: 503 }
      );
    }
    
    // Parse filters from query parameters
    const filters: ShotFilters = {
      teams: searchParams.get('teams')?.split(',').filter(Boolean),
      players: searchParams.get('players')?.split(',').filter(Boolean),
      periods: searchParams.get('periods')?.split(',').map(Number).filter(Boolean),
      shotTypes: searchParams.get('shotTypes')?.split(',').filter(Boolean),
      xGoalMin: searchParams.get('xGoalMin') ? Number(searchParams.get('xGoalMin')) : undefined,
      xGoalMax: searchParams.get('xGoalMax') ? Number(searchParams.get('xGoalMax')) : undefined,
      minDistance: searchParams.get('minDistance') ? Number(searchParams.get('minDistance')) : undefined,
      maxDistance: searchParams.get('maxDistance') ? Number(searchParams.get('maxDistance')) : undefined,
      homeTeam: searchParams.get('homeTeam') || undefined,
      awayTeam: searchParams.get('awayTeam') || undefined,
      season: searchParams.get('season') || '2023-24',
      gameId: searchParams.get('gameId') || undefined,
      shotResult: (searchParams.get('shotResult') as 'goal' | 'shot' | 'miss' | 'block') || undefined,
      situationCode: (searchParams.get('situationCode') as 'even' | 'powerplay' | 'shorthanded' | 'emptynet') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 5000,
      offset: searchParams.get('offset') ? Number(searchParams.get('offset')) : 0,
    };

    // Build the query
    let query = supabase
      .from('nhl_shots_2024')
      .select(`
        shot_id,
        x_cord,
        y_cord,
        x_goal,
        shooter_name,
        team_code,
        home_team_code,
        away_team_code,
        period,
        shot_type,
        shot_distance,
        shot_angle,
        shot_was_on_goal,
        shot_goal_probability,
        time_left,
        game_id,
        is_home_team,
        home_skaters_on_ice,
        away_skaters_on_ice,
        shot_on_empty_net
      `);

    // Apply filters
    if (filters.teams && filters.teams.length > 0) {
      query = query.in('team_code', filters.teams);
    }

    if (filters.players && filters.players.length > 0) {
      query = query.in('shooter_name', filters.players);
    }

    if (filters.periods && filters.periods.length > 0) {
      query = query.in('period', filters.periods);
    }

    if (filters.shotTypes && filters.shotTypes.length > 0) {
      query = query.in('shot_type', filters.shotTypes);
    }

    if (filters.xGoalMin !== undefined) {
      query = query.gte('x_goal', filters.xGoalMin);
    }

    if (filters.xGoalMax !== undefined) {
      query = query.lte('x_goal', filters.xGoalMax);
    }

    if (filters.minDistance !== undefined) {
      query = query.gte('shot_distance', filters.minDistance);
    }

    if (filters.maxDistance !== undefined) {
      query = query.lte('shot_distance', filters.maxDistance);
    }

    if (filters.homeTeam) {
      query = query.eq('home_team_code', filters.homeTeam);
    }

    if (filters.awayTeam) {
      query = query.eq('away_team_code', filters.awayTeam);
    }

    if (filters.gameId) {
      query = query.eq('game_id', filters.gameId);
    }

    // Apply situation filters
    if (filters.situationCode) {
      switch (filters.situationCode) {
        case 'even':
          query = query.eq('home_skaters_on_ice', 6).eq('away_skaters_on_ice', 6);
          break;
        case 'powerplay':
          query = query.or('home_skaters_on_ice.gt.6,away_skaters_on_ice.gt.6');
          break;
        case 'shorthanded':
          query = query.or('home_skaters_on_ice.lt.6,away_skaters_on_ice.lt.6');
          break;
        case 'emptynet':
          query = query.eq('shot_on_empty_net', true);
          break;
      }
    }

    // Apply shot result filter
    if (filters.shotResult) {
      switch (filters.shotResult) {
        case 'goal':
          query = query.gt('x_goal', 0.95); // Assuming goals have high xG
          break;
        case 'shot':
          query = query.eq('shot_was_on_goal', true);
          break;
        case 'miss':
          query = query.eq('shot_was_on_goal', false);
          break;
      }
    }

    // Apply pagination
    query = query
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 5000) - 1)
      .order('shot_id', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shot data', details: error.message },
        { status: 500 }
      );
    }

    // Transform data to ensure proper types
    const transformedData: ShotData[] = data?.map(shot => ({
      ...shot,
      x_cord: Number(shot.x_cord) || 0,
      y_cord: Number(shot.y_cord) || 0,
      x_goal: Number(shot.x_goal) || 0,
      shot_distance: Number(shot.shot_distance) || 0,
      shot_angle: Number(shot.shot_angle) || 0,
      shot_goal_probability: Number(shot.shot_goal_probability) || 0,
      time_left: Number(shot.time_left) || 0,
      period: Number(shot.period) || 1,
    })) || [];

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('nhl_shots_2024')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      data: transformedData,
      count: data?.length || 0,
      totalCount: totalCount || 0,
      filters: filters,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  // For future: bulk filtering with complex queries
  return NextResponse.json({ message: 'POST method not implemented yet' });
}
