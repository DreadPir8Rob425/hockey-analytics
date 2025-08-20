#!/usr/bin/env python3
"""
Import DAL.csv data into Supabase games table
"""

import os
import pandas as pd
import requests
import json
from datetime import datetime
import logging
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class GameDataImporter:
    def __init__(self, supabase_url: str, supabase_key: str, db_password: str):
        """
        Initialize the importer with Supabase REST API details
        
        Args:
            supabase_url: Your Supabase project URL
            supabase_key: Your Supabase service role key
            db_password: Your database password (not used for REST API)
        """
        self.supabase_url = supabase_url.rstrip('/')
        self.api_url = f"{self.supabase_url}/rest/v1"
        self.headers = {
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        }
        
    def test_connection(self):
        """Test connection to Supabase REST API"""
        try:
            logger.info("Testing connection to Supabase REST API...")
            response = requests.get(f"{self.api_url}/games?limit=1", headers=self.headers)
            
            if response.status_code == 200:
                logger.info("Successfully connected to Supabase REST API!")
                return True
            else:
                logger.error(f"Failed to connect to Supabase REST API. Status: {response.status_code}")
                logger.error(f"Response: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error testing connection: {e}")
            return False
    
    def load_csv_data(self, csv_file_path: str) -> pd.DataFrame:
        """Load and prepare CSV data"""
        try:
            logger.info(f"Loading CSV data from: {csv_file_path}")
            
            # Read the CSV file
            df = pd.read_csv(csv_file_path)
            logger.info(f"Loaded {len(df)} rows from CSV")
            
            # Convert column names from camelCase to snake_case to match database schema
            column_mapping = {
                'gameId': 'game_id',
                'playerTeam': 'player_team',
                'opposingTeam': 'opposing_team',
                'home_or_away': 'home_or_away',  # already correct
                'gameDate': 'game_date',
                'xGoalsPercentage': 'x_goals_percentage',
                'corsiPercentage': 'corsi_percentage',
                'fenwickPercentage': 'fenwick_percentage',
                'iceTime': 'ice_time',
                'xOnGoalFor': 'x_on_goal_for',
                'xGoalsFor': 'x_goals_for',
                'xReboundsFor': 'x_rebounds_for',
                'xFreezeFor': 'x_freeze_for',
                'xPlayStoppedFor': 'x_play_stopped_for',
                'xPlayContinuedInZoneFor': 'x_play_continued_in_zone_for',
                'xPlayContinuedOutsideZoneFor': 'x_play_continued_outside_zone_for',
                'flurryAdjustedxGoalsFor': 'flurry_adjusted_x_goals_for',
                'scoreVenueAdjustedxGoalsFor': 'score_venue_adjusted_x_goals_for',
                'flurryScoreVenueAdjustedxGoalsFor': 'flurry_score_venue_adjusted_x_goals_for',
                'shotsOnGoalFor': 'shots_on_goal_for',
                'missedShotsFor': 'missed_shots_for',
                'blockedShotAttemptsFor': 'blocked_shot_attempts_for',
                'shotAttemptsFor': 'shot_attempts_for',
                'goalsFor': 'goals_for',
                'reboundsFor': 'rebounds_for',
                'reboundGoalsFor': 'rebound_goals_for',
                'freezeFor': 'freeze_for',
                'playStoppedFor': 'play_stopped_for',
                'playContinuedInZoneFor': 'play_continued_in_zone_for',
                'playContinuedOutsideZoneFor': 'play_continued_outside_zone_for',
                'savedShotsOnGoalFor': 'saved_shots_on_goal_for',
                'savedUnblockedShotAttemptsFor': 'saved_unblocked_shot_attempts_for',
                'penaltiesFor': 'penalties_for',
                'penalityMinutesFor': 'penalty_minutes_for',  # Fix typo in source
                'faceOffsWonFor': 'face_offs_won_for',
                'hitsFor': 'hits_for',
                'takeawaysFor': 'takeaways_for',
                'giveawaysFor': 'giveaways_for',
                'lowDangerShotsFor': 'low_danger_shots_for',
                'mediumDangerShotsFor': 'medium_danger_shots_for',
                'highDangerShotsFor': 'high_danger_shots_for',
                'lowDangerxGoalsFor': 'low_danger_x_goals_for',
                'mediumDangerxGoalsFor': 'medium_danger_x_goals_for',
                'highDangerxGoalsFor': 'high_danger_x_goals_for',
                'lowDangerGoalsFor': 'low_danger_goals_for',
                'mediumDangerGoalsFor': 'medium_danger_goals_for',
                'highDangerGoalsFor': 'high_danger_goals_for',
                'scoreAdjustedShotsAttemptsFor': 'score_adjusted_shots_attempts_for',
                'unblockedShotAttemptsFor': 'unblocked_shot_attempts_for',
                'scoreAdjustedUnblockedShotAttemptsFor': 'score_adjusted_unblocked_shot_attempts_for',
                'dZoneGiveawaysFor': 'd_zone_giveaways_for',
                'xGoalsFromxReboundsOfShotsFor': 'x_goals_from_x_rebounds_of_shots_for',
                'xGoalsFromActualReboundsOfShotsFor': 'x_goals_from_actual_rebounds_of_shots_for',
                'reboundxGoalsFor': 'rebound_x_goals_for',
                'totalShotCreditFor': 'total_shot_credit_for',
                'scoreAdjustedTotalShotCreditFor': 'score_adjusted_total_shot_credit_for',
                'scoreFlurryAdjustedTotalShotCreditFor': 'score_flurry_adjusted_total_shot_credit_for',
                
                # Against columns
                'xOnGoalAgainst': 'x_on_goal_against',
                'xGoalsAgainst': 'x_goals_against',
                'xReboundsAgainst': 'x_rebounds_against',
                'xFreezeAgainst': 'x_freeze_against',
                'xPlayStoppedAgainst': 'x_play_stopped_against',
                'xPlayContinuedInZoneAgainst': 'x_play_continued_in_zone_against',
                'xPlayContinuedOutsideZoneAgainst': 'x_play_continued_outside_zone_against',
                'flurryAdjustedxGoalsAgainst': 'flurry_adjusted_x_goals_against',
                'scoreVenueAdjustedxGoalsAgainst': 'score_venue_adjusted_x_goals_against',
                'flurryScoreVenueAdjustedxGoalsAgainst': 'flurry_score_venue_adjusted_x_goals_against',
                'shotsOnGoalAgainst': 'shots_on_goal_against',
                'missedShotsAgainst': 'missed_shots_against',
                'blockedShotAttemptsAgainst': 'blocked_shot_attempts_against',
                'shotAttemptsAgainst': 'shot_attempts_against',
                'goalsAgainst': 'goals_against',
                'reboundsAgainst': 'rebounds_against',
                'reboundGoalsAgainst': 'rebound_goals_against',
                'freezeAgainst': 'freeze_against',
                'playStoppedAgainst': 'play_stopped_against',
                'playContinuedInZoneAgainst': 'play_continued_in_zone_against',
                'playContinuedOutsideZoneAgainst': 'play_continued_outside_zone_against',
                'savedShotsOnGoalAgainst': 'saved_shots_on_goal_against',
                'savedUnblockedShotAttemptsAgainst': 'saved_unblocked_shot_attempts_against',
                'penaltiesAgainst': 'penalties_against',
                'penalityMinutesAgainst': 'penalty_minutes_against',  # Fix typo in source
                'faceOffsWonAgainst': 'face_offs_won_against',
                'hitsAgainst': 'hits_against',
                'takeawaysAgainst': 'takeaways_against',
                'giveawaysAgainst': 'giveaways_against',
                'lowDangerShotsAgainst': 'low_danger_shots_against',
                'mediumDangerShotsAgainst': 'medium_danger_shots_against',
                'highDangerShotsAgainst': 'high_danger_shots_against',
                'lowDangerxGoalsAgainst': 'low_danger_x_goals_against',
                'mediumDangerxGoalsAgainst': 'medium_danger_x_goals_against',
                'highDangerxGoalsAgainst': 'high_danger_x_goals_against',
                'lowDangerGoalsAgainst': 'low_danger_goals_against',
                'mediumDangerGoalsAgainst': 'medium_danger_goals_against',
                'highDangerGoalsAgainst': 'high_danger_goals_against',
                'scoreAdjustedShotsAttemptsAgainst': 'score_adjusted_shots_attempts_against',
                'unblockedShotAttemptsAgainst': 'unblocked_shot_attempts_against',
                'scoreAdjustedUnblockedShotAttemptsAgainst': 'score_adjusted_unblocked_shot_attempts_against',
                'dZoneGiveawaysAgainst': 'd_zone_giveaways_against',
                'xGoalsFromxReboundsOfShotsAgainst': 'x_goals_from_x_rebounds_of_shots_against',
                'xGoalsFromActualReboundsOfShotsAgainst': 'x_goals_from_actual_rebounds_of_shots_against',
                'reboundxGoalsAgainst': 'rebound_x_goals_against',
                'totalShotCreditAgainst': 'total_shot_credit_against',
                'scoreAdjustedTotalShotCreditAgainst': 'score_adjusted_total_shot_credit_against',
                'scoreFlurryAdjustedTotalShotCreditAgainst': 'score_flurry_adjusted_total_shot_credit_against'
            }
            
            # Rename columns that need mapping
            df = df.rename(columns=column_mapping)
            
            # Convert gameDate from YYYYMMDD to proper date format
            df['game_date'] = pd.to_datetime(df['game_date'], format='%Y%m%d')
            
            # Handle any NaN values - replace with None for SQL NULL
            df = df.where(pd.notnull(df), None)
            
            logger.info("CSV data processed successfully")
            return df
            
        except Exception as e:
            logger.error(f"Error loading CSV data: {e}")
            raise
    
    def prepare_data_for_api(self, df: pd.DataFrame):
        """Prepare DataFrame data for REST API insertion"""
        # Remove any columns that shouldn't be inserted
        excluded_columns = ['id', 'created_at', 'updated_at']
        df_clean = df.drop(columns=[col for col in excluded_columns if col in df.columns])
        
        # Define which columns should be integers (based on the database schema)
        integer_columns = [
            'season', 'shots_on_goal_for', 'missed_shots_for', 'blocked_shot_attempts_for',
            'shot_attempts_for', 'goals_for', 'rebounds_for', 'rebound_goals_for',
            'freeze_for', 'play_stopped_for', 'play_continued_in_zone_for',
            'play_continued_outside_zone_for', 'saved_shots_on_goal_for',
            'saved_unblocked_shot_attempts_for', 'penalties_for', 'penalty_minutes_for',
            'face_offs_won_for', 'hits_for', 'takeaways_for', 'giveaways_for',
            'low_danger_shots_for', 'medium_danger_shots_for', 'high_danger_shots_for',
            'low_danger_goals_for', 'medium_danger_goals_for', 'high_danger_goals_for',
            'unblocked_shot_attempts_for', 'd_zone_giveaways_for',
            # Against columns
            'shots_on_goal_against', 'missed_shots_against', 'blocked_shot_attempts_against',
            'shot_attempts_against', 'goals_against', 'rebounds_against', 'rebound_goals_against',
            'freeze_against', 'play_stopped_against', 'play_continued_in_zone_against',
            'play_continued_outside_zone_against', 'saved_shots_on_goal_against',
            'saved_unblocked_shot_attempts_against', 'penalties_against', 'penalty_minutes_against',
            'face_offs_won_against', 'hits_against', 'takeaways_against', 'giveaways_against',
            'low_danger_shots_against', 'medium_danger_shots_against', 'high_danger_shots_against',
            'low_danger_goals_against', 'medium_danger_goals_against', 'high_danger_goals_against',
            'unblocked_shot_attempts_against', 'd_zone_giveaways_against'
        ]
        
        # Convert integer columns
        for col in integer_columns:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].fillna(0).astype(int)
        
        # Convert DataFrame to list of dictionaries
        records = df_clean.to_dict('records')
        
        # Convert date objects to strings for JSON serialization
        for record in records:
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
                elif isinstance(value, pd.Timestamp):
                    record[key] = value.strftime('%Y-%m-%d')
        
        return records
    
    def import_data(self, df: pd.DataFrame, batch_size: int = 1000):
        """Import data into the games table via REST API"""
        try:
            # Prepare data for API
            records = self.prepare_data_for_api(df)
            total_rows = len(records)
            
            logger.info(f"Inserting {total_rows} rows in batches of {batch_size} via REST API")
            
            # Insert data in batches
            for i in range(0, total_rows, batch_size):
                batch = records[i:i + batch_size]
                
                # Make POST request to Supabase
                response = requests.post(
                    f"{self.api_url}/games",
                    headers=self.headers,
                    json=batch
                )
                
                if response.status_code in [201, 200]:
                    logger.info(f"Inserted batch {i//batch_size + 1}: rows {i+1} to {min(i+batch_size, total_rows)}")
                else:
                    logger.error(f"Failed to insert batch {i//batch_size + 1}")
                    logger.error(f"Status: {response.status_code}")
                    logger.error(f"Response: {response.text}")
                    raise Exception(f"API request failed with status {response.status_code}")
            
            logger.info(f"Successfully imported all {total_rows} rows")
            
        except Exception as e:
            logger.error(f"Error importing data: {e}")
            raise
    
    def run_import(self, csv_file_path: str, batch_size: int = 1000):
        """Main method to run the complete import process"""
        try:
            # Test API connection
            if not self.test_connection():
                return False
            
            # Load and process CSV data
            df = self.load_csv_data(csv_file_path)
            
            # Import data
            self.import_data(df, batch_size)
            
            logger.info("Import process completed successfully!")
            return True
            
        except Exception as e:
            logger.error(f"Import process failed: {e}")
            return False


def main():
    """Main function to run the import"""
    
    # Configuration - Replace with your actual Supabase details
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-project-ref.supabase.co')
    SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY', 'your-service-role-key')
    DB_PASSWORD = os.getenv('SUPABASE_DB_PASSWORD', 'your-db-password')
    
    # Path to your CSV file
    CSV_FILE_PATH = 'DAL.csv'
    
    # Check if CSV file exists
    if not os.path.exists(CSV_FILE_PATH):
        logger.error(f"CSV file not found: {CSV_FILE_PATH}")
        logger.error("Please ensure the DAL.csv file is in the same directory as this script")
        return
    
    # Check if environment variables are set
    if 'your-project-ref' in SUPABASE_URL or 'your-service-role-key' in SUPABASE_KEY:
        logger.error("Please set your Supabase environment variables:")
        logger.error("export SUPABASE_URL='https://your-project-ref.supabase.co'")
        logger.error("export SUPABASE_SERVICE_KEY='your-service-role-key'")
        logger.error("export SUPABASE_DB_PASSWORD='your-db-password'")
        return
    
    # Create importer and run
    importer = GameDataImporter(SUPABASE_URL, SUPABASE_KEY, DB_PASSWORD)
    success = importer.run_import(CSV_FILE_PATH, batch_size=500)
    
    if success:
        print("\n✅ Data import completed successfully!")
        print("You can now query your games table in Supabase.")
    else:
        print("\n❌ Data import failed. Check the logs above for details.")


if __name__ == "__main__":
    main()
