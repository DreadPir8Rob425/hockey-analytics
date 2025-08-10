#!/usr/bin/env python3
"""
Clear existing data and run full import
"""

# SUPABASE CREDENTIALS
SUPABASE_URL = "{{SUPABASE_URL}}"
SUPABASE_KEY = "{{SUPABASE_ANON_KEY}}"

import pandas as pd
from supabase import create_client
import numpy as np
import time

print("🔗 Connecting to Supabase...")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("🗑️  Clearing existing data...")
# Clear the table first
try:
    # Delete all rows
    result = supabase.table('nhl_shots_2024').delete().neq('shot_id', 0).execute()
    print("✅ Cleared existing data")
except Exception as e:
    print(f"⚠️  Could not clear data (table might be empty): {e}")

print("📖 Reading CSV file...")
csv_file = '../data/shots_2024.csv'
df = pd.read_csv(csv_file)
print(f"✅ Loaded {len(df)} rows")

# Column mapping (comprehensive)
column_mapping = {
    'shotID': 'shot_id',
    'arenaAdjustedShotDistance': 'arena_adjusted_shot_distance',
    'arenaAdjustedXCord': 'arena_adjusted_x_cord',
    'arenaAdjustedXCordABS': 'arena_adjusted_x_cord_abs',
    'arenaAdjustedYCord': 'arena_adjusted_y_cord',
    'arenaAdjustedYCordAbs': 'arena_adjusted_y_cord_abs',
    'averageRestDifference': 'average_rest_difference',
    'awayEmptyNet': 'away_empty_net',
    'awayPenalty1Length': 'away_penalty1_length',
    'awayPenalty1TimeLeft': 'away_penalty1_time_left',
    'awaySkatersOnIce': 'away_skaters_on_ice',
    'awayTeamCode': 'away_team_code',
    'awayTeamGoals': 'away_team_goals',
    'defendingTeamAverageTimeOnIce': 'defending_team_average_time_on_ice',
    'defendingTeamAverageTimeOnIceOfDefencemen': 'defending_team_average_time_on_ice_of_defencemen',
    'defendingTeamAverageTimeOnIceOfDefencemenSinceFaceoff': 'defending_team_average_time_on_ice_of_defencemen_since_faceoff',
    'defendingTeamAverageTimeOnIceOfForwards': 'defending_team_average_time_on_ice_of_forwards',
    'defendingTeamAverageTimeOnIceOfForwardsSinceFaceoff': 'defending_team_average_time_on_ice_of_forwards_since_faceoff',
    'defendingTeamAverageTimeOnIceSinceFaceoff': 'defending_team_average_time_on_ice_since_faceoff',
    'defendingTeamDefencemenOnIce': 'defending_team_defencemen_on_ice',
    'defendingTeamForwardsOnIce': 'defending_team_forwards_on_ice',
    'defendingTeamMaxTimeOnIce': 'defending_team_max_time_on_ice',
    'defendingTeamMaxTimeOnIceOfDefencemen': 'defending_team_max_time_on_ice_of_defencemen',
    'defendingTeamMaxTimeOnIceOfDefencemenSinceFaceoff': 'defending_team_max_time_on_ice_of_defencemen_since_faceoff',
    'defendingTeamMaxTimeOnIceOfForwards': 'defending_team_max_time_on_ice_of_forwards',
    'defendingTeamMaxTimeOnIceOfForwardsSinceFaceoff': 'defending_team_max_time_on_ice_of_forwards_since_faceoff',
    'defendingTeamMaxTimeOnIceSinceFaceoff': 'defending_team_max_time_on_ice_since_faceoff',
    'defendingTeamMinTimeOnIce': 'defending_team_min_time_on_ice',
    'defendingTeamMinTimeOnIceOfDefencemen': 'defending_team_min_time_on_ice_of_defencemen',
    'defendingTeamMinTimeOnIceOfDefencemenSinceFaceoff': 'defending_team_min_time_on_ice_of_defencemen_since_faceoff',
    'defendingTeamMinTimeOnIceOfForwards': 'defending_team_min_time_on_ice_of_forwards',
    'defendingTeamMinTimeOnIceOfForwardsSinceFaceoff': 'defending_team_min_time_on_ice_of_forwards_since_faceoff',
    'defendingTeamMinTimeOnIceSinceFaceoff': 'defending_team_min_time_on_ice_since_faceoff',
    'distanceFromLastEvent': 'distance_from_last_event',
    'gameOver': 'game_over',
    'game_id': 'game_id',
    'goalieIdForShot': 'goalie_id_for_shot',
    'goalieNameForShot': 'goalie_name_for_shot',
    'homeEmptyNet': 'home_empty_net',
    'homePenalty1Length': 'home_penalty1_length',
    'homePenalty1TimeLeft': 'home_penalty1_time_left',
    'homeSkatersOnIce': 'home_skaters_on_ice',
    'homeTeamCode': 'home_team_code',
    'homeTeamGoals': 'home_team_goals',
    'homeTeamScore': 'home_team_score',
    'homeTeamWon': 'home_team_won',
    'homeWinProbability': 'home_win_probability',
    'isHomeTeam': 'is_home_team',
    'isPlayoffGame': 'is_playoff_game',
    'lastEventCategory': 'last_event_category',
    'lastEventShotAngle': 'last_event_shot_angle',
    'lastEventShotDistance': 'last_event_shot_distance',
    'lastEventTeam': 'last_event_team',
    'lastEventxCord': 'last_event_x_cord',
    'lastEventxCord_adjusted': 'last_event_x_cord_adjusted',
    'lastEventyCord': 'last_event_y_cord',
    'lastEventyCord_adjusted': 'last_event_y_cord_adjusted',
    'offWing': 'off_wing',
    'penaltyLength': 'penalty_length',
    'playerNumThatDidEvent': 'player_num_that_did_event',
    'playerNumThatDidLastEvent': 'player_num_that_did_last_event',
    'playerPositionThatDidEvent': 'player_position_that_did_event',
    'playoffGame': 'playoff_game',
    'roadTeamCode': 'road_team_code',
    'roadTeamScore': 'road_team_score',
    'shooterLeftRight': 'shooter_left_right',
    'shooterName': 'shooter_name',
    'shooterPlayerId': 'shooter_player_id',
    'shooterTimeOnIce': 'shooter_time_on_ice',
    'shooterTimeOnIceSinceFaceoff': 'shooter_time_on_ice_since_faceoff',
    'shootingTeamAverageTimeOnIce': 'shooting_team_average_time_on_ice',
    'shootingTeamAverageTimeOnIceOfDefencemen': 'shooting_team_average_time_on_ice_of_defencemen',
    'shootingTeamAverageTimeOnIceOfDefencemenSinceFaceoff': 'shooting_team_average_time_on_ice_of_defencemen_since_faceoff',
    'shootingTeamAverageTimeOnIceOfForwards': 'shooting_team_average_time_on_ice_of_forwards',
    'shootingTeamAverageTimeOnIceOfForwardsSinceFaceoff': 'shooting_team_average_time_on_ice_of_forwards_since_faceoff',
    'shootingTeamAverageTimeOnIceSinceFaceoff': 'shooting_team_average_time_on_ice_since_faceoff',
    'shootingTeamDefencemenOnIce': 'shooting_team_defencemen_on_ice',
    'shootingTeamForwardsOnIce': 'shooting_team_forwards_on_ice',
    'shootingTeamMaxTimeOnIce': 'shooting_team_max_time_on_ice',
    'shootingTeamMaxTimeOnIceOfDefencemen': 'shooting_team_max_time_on_ice_of_defencemen',
    'shootingTeamMaxTimeOnIceOfDefencemenSinceFaceoff': 'shooting_team_max_time_on_ice_of_defencemen_since_faceoff',
    'shootingTeamMaxTimeOnIceOfForwards': 'shooting_team_max_time_on_ice_of_forwards',
    'shootingTeamMaxTimeOnIceOfForwardsSinceFaceoff': 'shooting_team_max_time_on_ice_of_forwards_since_faceoff',
    'shootingTeamMaxTimeOnIceSinceFaceoff': 'shooting_team_max_time_on_ice_since_faceoff',
    'shootingTeamMinTimeOnIce': 'shooting_team_min_time_on_ice',
    'shootingTeamMinTimeOnIceOfDefencemen': 'shooting_team_min_time_on_ice_of_defencemen',
    'shootingTeamMinTimeOnIceOfDefencemenSinceFaceoff': 'shooting_team_min_time_on_ice_of_defencemen_since_faceoff',
    'shootingTeamMinTimeOnIceOfForwards': 'shooting_team_min_time_on_ice_of_forwards',
    'shootingTeamMinTimeOnIceOfForwardsSinceFaceoff': 'shooting_team_min_time_on_ice_of_forwards_since_faceoff',
    'shootingTeamMinTimeOnIceSinceFaceoff': 'shooting_team_min_time_on_ice_since_faceoff',
    'shotAngle': 'shot_angle',
    'shotAngleAdjusted': 'shot_angle_adjusted',
    'shotAnglePlusRebound': 'shot_angle_plus_rebound',
    'shotAnglePlusReboundSpeed': 'shot_angle_plus_rebound_speed',
    'shotAngleReboundRoyalRoad': 'shot_angle_rebound_royal_road',
    'shotDistance': 'shot_distance',
    'shotGeneratedRebound': 'shot_generated_rebound',
    'shotGoalProbability': 'shot_goal_probability',
    'shotGoalieFroze': 'shot_goalie_froze',
    'shotOnEmptyNet': 'shot_on_empty_net',
    'shotPlayContinued': 'shot_play_continued',
    'shotPlayContinuedInZone': 'shot_play_continued_in_zone',
    'shotPlayContinuedOutsideZone': 'shot_play_continued_outside_zone',
    'shotPlayStopped': 'shot_play_stopped',
    'shotRebound': 'shot_rebound',
    'shotRush': 'shot_rush',
    'shotType': 'shot_type',
    'shotWasOnGoal': 'shot_was_on_goal',
    'speedFromLastEvent': 'speed_from_last_event',
    'teamCode': 'team_code',
    'timeBetweenEvents': 'time_between_events',
    'timeDifferenceSinceChange': 'time_difference_since_change',
    'timeLeft': 'time_left',
    'timeSinceFaceoff': 'time_since_faceoff',
    'timeSinceLastEvent': 'time_since_last_event',
    'timeUntilNextEvent': 'time_until_next_event',
    'wentToOT': 'went_to_ot',
    'wentToShootout': 'went_to_shootout',
    'xCord': 'x_cord',
    'xCordAdjusted': 'x_cord_adjusted',
    'xFroze': 'x_froze',
    'xGoal': 'x_goal',
    'xPlayContinuedInZone': 'x_play_continued_in_zone',
    'xPlayContinuedOutsideZone': 'x_play_continued_outside_zone',
    'xPlayStopped': 'x_play_stopped',
    'xRebound': 'x_rebound',
    'xShotWasOnGoal': 'x_shot_was_on_goal',
    'yCord': 'y_cord',
    'yCordAdjusted': 'y_cord_adjusted'
}

df = df.rename(columns=column_mapping)
df = df.replace({np.nan: None})

print("🚀 Starting full import...")
print(f"   📊 Total rows: {len(df):,}")
print(f"   📦 Batch size: 500")
print(f"   ⏱️  Estimated time: ~{len(df)//500//10} minutes")

batch_size = 500
total_rows = len(df)
start_time = time.time()

for i in range(0, total_rows, batch_size):
    batch = df.iloc[i:i+batch_size]
    batch_dict = batch.to_dict('records')
    
    try:
        result = supabase.table('nhl_shots_2024').insert(batch_dict).execute()
        batch_num = i//batch_size + 1
        total_batches = (total_rows - 1)//batch_size + 1
        progress = (batch_num / total_batches) * 100
        
        elapsed = time.time() - start_time
        if batch_num > 1:
            eta = (elapsed / (batch_num - 1)) * (total_batches - batch_num)
            print(f"✅ Batch {batch_num}/{total_batches} ({progress:.1f}%) - ETA: {eta/60:.1f}m")
        else:
            print(f"✅ Batch {batch_num}/{total_batches} ({progress:.1f}%)")
            
    except Exception as e:
        print(f"❌ Error in batch {i//batch_size + 1}: {e}")
        break

elapsed = time.time() - start_time
print(f"🎉 Import completed in {elapsed/60:.1f} minutes!")
print(f"📊 Successfully imported {len(df):,} NHL shot records!")
