import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create supabase client if environment variables are available
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function GET(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Fallback to sample data for demo purposes
    console.warn('Supabase not configured, returning sample data');
    const sampleGames = [
      {
        id: 1,
        team: 'TOR',
        season: 2024,
        game_id: '2024020001',
        opposing_team: 'MTL',
        home_or_away: 'HOME',
        game_date: '2024-10-09',
        situation: 'all',
        goals_for: 3,
        goals_against: 2,
        shots_on_goal_for: 32,
        shots_on_goal_against: 28,
        x_goals_for: 2.8,
        x_goals_against: 2.1,
        corsi_percentage: 0.547,
        fenwick_percentage: 0.532,
        face_offs_won_for: 28,
        face_offs_won_against: 32,
        hits_for: 18,
        hits_against: 22,
        penalties_for: 6,
        penalties_against: 4,
        ice_time: 3600
      }
    ];
    
    return NextResponse.json({
      games: sampleGames,
      count: sampleGames.length,
      totalCount: sampleGames.length,
      hasMore: false
    });
  }
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const team = searchParams.get('team');
    const season = searchParams.get('season');

    // Build query to get unique games by filtering for 'all' situation (which contains full game stats)
    let query = supabase
      .from('games')
      .select(`
        id,
        team,
        season,
        game_id,
        opposing_team,
        home_or_away,
        game_date,
        position,
        situation,
        goals_for,
        goals_against,
        shots_on_goal_for,
        shots_on_goal_against,
        x_goals_for,
        x_goals_against,
        corsi_percentage,
        fenwick_percentage,
        face_offs_won_for,
        face_offs_won_against,
        hits_for,
        hits_against,
        penalties_for,
        penalties_against,
        ice_time
      `)
      .eq('situation', 'all') // Always show full game stats
      .range(offset, offset + limit - 1)
      .order('game_date', { ascending: false });

    // Apply additional filters
    if (team) {
      query = query.eq('team', team);
    }
    if (season) {
      query = query.eq('season', parseInt(season));
    }

    const { data: games, error } = await query;

    if (error) {
      console.error('Supabase error fetching games:', error);
      return NextResponse.json(
        { error: 'Failed to fetch games', details: error.message },
        { status: 500 }
      );
    }

    // Get total count for pagination (count unique games, not situation rows)
    let countQuery = supabase
      .from('games')
      .select('*', { count: 'exact', head: true })
      .eq('situation', 'all');

    if (team) countQuery = countQuery.eq('team', team);
    if (season) countQuery = countQuery.eq('season', parseInt(season));

    const { count } = await countQuery;

    console.log(`Games API: Found ${games?.length || 0} games (${count} total unique games)`);
    
    return NextResponse.json({
      games: games || [],
      count: games?.length || 0,
      totalCount: count || 0,
      hasMore: (offset + limit) < (count || 0)
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
