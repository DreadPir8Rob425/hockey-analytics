-- Create games table for hockey analytics in Supabase
-- Based on the structure of DAL.csv file

CREATE TABLE games (
    -- Primary identifiers
    id SERIAL PRIMARY KEY,
    team VARCHAR(10) NOT NULL,
    season INTEGER NOT NULL,
    name VARCHAR(10) NOT NULL,
    game_id VARCHAR(20) NOT NULL,
    player_team VARCHAR(10) NOT NULL,
    opposing_team VARCHAR(10) NOT NULL,
    home_or_away VARCHAR(10) NOT NULL,
    game_date DATE NOT NULL,
    position VARCHAR(50) NOT NULL,
    situation VARCHAR(20) NOT NULL,

    -- Performance metrics (percentages as decimals)
    x_goals_percentage DECIMAL(8,4),
    corsi_percentage DECIMAL(8,4),
    fenwick_percentage DECIMAL(8,4),
    ice_time DECIMAL(8,1),

    -- Expected stats (FOR)
    x_on_goal_for DECIMAL(8,3),
    x_goals_for DECIMAL(8,3),
    x_rebounds_for DECIMAL(8,3),
    x_freeze_for DECIMAL(8,3),
    x_play_stopped_for DECIMAL(8,3),
    x_play_continued_in_zone_for DECIMAL(8,3),
    x_play_continued_outside_zone_for DECIMAL(8,3),
    flurry_adjusted_x_goals_for DECIMAL(8,3),
    score_venue_adjusted_x_goals_for DECIMAL(8,3),
    flurry_score_venue_adjusted_x_goals_for DECIMAL(8,3),

    -- Actual stats (FOR)
    shots_on_goal_for INTEGER,
    missed_shots_for INTEGER,
    blocked_shot_attempts_for INTEGER,
    shot_attempts_for INTEGER,
    goals_for INTEGER,
    rebounds_for INTEGER,
    rebound_goals_for INTEGER,
    freeze_for INTEGER,
    play_stopped_for INTEGER,
    play_continued_in_zone_for INTEGER,
    play_continued_outside_zone_for INTEGER,
    saved_shots_on_goal_for INTEGER,
    saved_unblocked_shot_attempts_for INTEGER,
    penalties_for INTEGER,
    penalty_minutes_for INTEGER,
    face_offs_won_for INTEGER,
    hits_for INTEGER,
    takeaways_for INTEGER,
    giveaways_for INTEGER,

    -- Danger-based stats (FOR)
    low_danger_shots_for INTEGER,
    medium_danger_shots_for INTEGER,
    high_danger_shots_for INTEGER,
    low_danger_x_goals_for DECIMAL(8,3),
    medium_danger_x_goals_for DECIMAL(8,3),
    high_danger_x_goals_for DECIMAL(8,3),
    low_danger_goals_for INTEGER,
    medium_danger_goals_for INTEGER,
    high_danger_goals_for INTEGER,

    -- Adjusted stats (FOR)
    score_adjusted_shots_attempts_for DECIMAL(8,3),
    unblocked_shot_attempts_for INTEGER,
    score_adjusted_unblocked_shot_attempts_for DECIMAL(8,3),
    d_zone_giveaways_for INTEGER,
    x_goals_from_x_rebounds_of_shots_for DECIMAL(8,3),
    x_goals_from_actual_rebounds_of_shots_for DECIMAL(8,3),
    rebound_x_goals_for DECIMAL(8,3),
    total_shot_credit_for DECIMAL(8,3),
    score_adjusted_total_shot_credit_for DECIMAL(8,3),
    score_flurry_adjusted_total_shot_credit_for DECIMAL(8,3),

    -- Expected stats (AGAINST)
    x_on_goal_against DECIMAL(8,3),
    x_goals_against DECIMAL(8,3),
    x_rebounds_against DECIMAL(8,3),
    x_freeze_against DECIMAL(8,3),
    x_play_stopped_against DECIMAL(8,3),
    x_play_continued_in_zone_against DECIMAL(8,3),
    x_play_continued_outside_zone_against DECIMAL(8,3),
    flurry_adjusted_x_goals_against DECIMAL(8,3),
    score_venue_adjusted_x_goals_against DECIMAL(8,3),
    flurry_score_venue_adjusted_x_goals_against DECIMAL(8,3),

    -- Actual stats (AGAINST)
    shots_on_goal_against INTEGER,
    missed_shots_against INTEGER,
    blocked_shot_attempts_against INTEGER,
    shot_attempts_against INTEGER,
    goals_against INTEGER,
    rebounds_against INTEGER,
    rebound_goals_against INTEGER,
    freeze_against INTEGER,
    play_stopped_against INTEGER,
    play_continued_in_zone_against INTEGER,
    play_continued_outside_zone_against INTEGER,
    saved_shots_on_goal_against INTEGER,
    saved_unblocked_shot_attempts_against INTEGER,
    penalties_against INTEGER,
    penalty_minutes_against INTEGER,
    face_offs_won_against INTEGER,
    hits_against INTEGER,
    takeaways_against INTEGER,
    giveaways_against INTEGER,

    -- Danger-based stats (AGAINST)
    low_danger_shots_against INTEGER,
    medium_danger_shots_against INTEGER,
    high_danger_shots_against INTEGER,
    low_danger_x_goals_against DECIMAL(8,3),
    medium_danger_x_goals_against DECIMAL(8,3),
    high_danger_x_goals_against DECIMAL(8,3),
    low_danger_goals_against INTEGER,
    medium_danger_goals_against INTEGER,
    high_danger_goals_against INTEGER,

    -- Adjusted stats (AGAINST)
    score_adjusted_shots_attempts_against DECIMAL(8,3),
    unblocked_shot_attempts_against INTEGER,
    score_adjusted_unblocked_shot_attempts_against DECIMAL(8,3),
    d_zone_giveaways_against INTEGER,
    x_goals_from_x_rebounds_of_shots_against DECIMAL(8,3),
    x_goals_from_actual_rebounds_of_shots_against DECIMAL(8,3),
    rebound_x_goals_against DECIMAL(8,3),
    total_shot_credit_against DECIMAL(8,3),
    score_adjusted_total_shot_credit_against DECIMAL(8,3),
    score_flurry_adjusted_total_shot_credit_against DECIMAL(8,3),

    -- Audit columns
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_games_game_id ON games(game_id);
CREATE INDEX idx_games_team_season ON games(team, season);
CREATE INDEX idx_games_game_date ON games(game_date);
CREATE INDEX idx_games_team_opposing_team ON games(team, opposing_team);
CREATE INDEX idx_games_situation ON games(situation);

-- Create composite index for common queries
CREATE INDEX idx_games_team_season_situation ON games(team, season, situation);

-- Add unique constraint to prevent duplicate game records
-- (assuming each combination of game_id, team, and situation should be unique)
CREATE UNIQUE INDEX idx_games_unique_record ON games(game_id, team, situation);

-- Add check constraints for data quality
ALTER TABLE games ADD CONSTRAINT chk_home_or_away 
    CHECK (home_or_away IN ('HOME', 'AWAY'));

ALTER TABLE games ADD CONSTRAINT chk_season_valid 
    CHECK (season >= 2000 AND season <= 2030);

-- Add comments for documentation
COMMENT ON TABLE games IS 'Hockey game statistics and analytics data';
COMMENT ON COLUMN games.game_id IS 'Unique identifier for each game (format: YYYYMMDDNN)';
COMMENT ON COLUMN games.situation IS 'Game situation (e.g., 5on5, 4on5, 5on4, all, other)';
COMMENT ON COLUMN games.x_goals_percentage IS 'Expected goals percentage';
COMMENT ON COLUMN games.corsi_percentage IS 'Corsi percentage (shot attempt differential)';
COMMENT ON COLUMN games.fenwick_percentage IS 'Fenwick percentage (unblocked shot attempt differential)';
COMMENT ON COLUMN games.ice_time IS 'Ice time in seconds';
