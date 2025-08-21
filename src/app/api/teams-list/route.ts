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
    // Get distinct teams from the games table
    const { data: teams, error } = await supabase
      .from('games')
      .select('team')
      .not('team', 'is', null)
      .order('team');

    if (error) {
      console.error('Supabase error fetching teams:', error);
      return NextResponse.json(
        { error: 'Failed to fetch teams', details: error.message },
        { status: 500 }
      );
    }

    // Get unique teams
    const uniqueTeams = Array.from(new Set(teams.map(t => t.team))).sort();

    console.log(`Teams List API: Found ${uniqueTeams.length} teams`);
    
    return NextResponse.json({
      teams: uniqueTeams,
      count: uniqueTeams.length
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
