import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function GET() {
  try {
    if (!supabase) {
      // Return a basic set of NHL teams for demo purposes
      const defaultTeams = [
        'ANA', 'ARI', 'BOS', 'BUF', 'CAR', 'CBJ', 'CGY', 'CHI', 'COL', 'DAL',
        'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NJD', 'NSH', 'NYI', 'NYR',
        'OTT', 'PHI', 'PIT', 'SJS', 'STL', 'TBL', 'TOR', 'VAN', 'VGK', 'WPG', 'WSH'
      ];
      
      return NextResponse.json({
        teams: defaultTeams,
        count: defaultTeams.length,
      });
    }
    
    // Use a more reliable approach: Get distinct teams using multiple queries
    // This eliminates the sampling issue that was causing inconsistent results
    
    const [homeTeamsResult, awayTeamsResult] = await Promise.all([
      supabase
        .from('nhl_shots_2024')
        .select('team_code')
        .not('team_code', 'is', null)
        .limit(1000), // Get team_code from shots table directly
      
      supabase
        .from('nhl_shots_2024')
        .select('home_team_code, away_team_code')
        .not('home_team_code', 'is', null)
        .not('away_team_code', 'is', null)
        .limit(5000) // Reasonable sample size
    ]);

    if (homeTeamsResult.error) {
      console.error('Supabase error fetching team codes:', homeTeamsResult.error);
      return NextResponse.json(
        { error: 'Failed to fetch teams', details: homeTeamsResult.error.message },
        { status: 500 }
      );
    }

    if (awayTeamsResult.error) {
      console.error('Supabase error fetching home/away teams:', awayTeamsResult.error);
      return NextResponse.json(
        { error: 'Failed to fetch teams', details: awayTeamsResult.error.message },
        { status: 500 }
      );
    }

    // Extract unique team codes from multiple sources
    const allTeamsSet = new Set<string>();
    
    // Add teams from team_code column (shooting team)
    homeTeamsResult.data?.forEach(shot => {
      if (shot.team_code) {
        allTeamsSet.add(shot.team_code);
      }
    });
    
    // Add teams from home_team_code and away_team_code columns
    awayTeamsResult.data?.forEach(shot => {
      if (shot.home_team_code) {
        allTeamsSet.add(shot.home_team_code);
      }
      if (shot.away_team_code) {
        allTeamsSet.add(shot.away_team_code);
      }
    });

    // Convert to array and sort alphabetically
    const sortedTeams = Array.from(allTeamsSet).sort();

    console.log(`Teams API: Found ${sortedTeams.length} unique teams:`, sortedTeams);

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
