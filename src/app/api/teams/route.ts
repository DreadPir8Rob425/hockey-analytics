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

export async function GET() {
  try {
    // Get a large sample of data to extract unique team codes from both home and away teams
    const { data: shots, error } = await supabase
      .from('nhl_shots_2024')
      .select('home_team_code, away_team_code')
      .limit(10000); // Use a large sample to ensure we get all teams

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch teams', details: error.message },
        { status: 500 }
      );
    }

    // Extract unique team codes from both home and away
    const allTeamsSet = new Set<string>();
    
    shots?.forEach(shot => {
      if (shot.home_team_code) {
        allTeamsSet.add(shot.home_team_code);
      }
      if (shot.away_team_code) {
        allTeamsSet.add(shot.away_team_code);
      }
    });

    // Convert to array and sort alphabetically
    const sortedTeams = Array.from(allTeamsSet).sort();

    return NextResponse.json({
      teams: sortedTeams,
      count: sortedTeams.length,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
