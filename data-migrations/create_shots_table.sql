-- Create NHL Shots 2024 table in Supabase
-- This table contains shot data for the NHL 2024 season

DROP TABLE IF EXISTS nhl_shots_2024;

CREATE TABLE nhl_shots_2024 (
    -- Shot identification
    shot_id INTEGER,
    
    -- Arena adjusted coordinates and distances  
    arena_adjusted_shot_distance DECIMAL(10,4),
    arena_adjusted_x_cord DECIMAL(10,4),
    arena_adjusted_x_cord_abs DECIMAL(10,4),
    arena_adjusted_y_cord DECIMAL(10,4),
    arena_adjusted_y_cord_abs DECIMAL(10,4),
    
    -- Team and game info
    average_rest_difference DECIMAL(10,4),
    away_empty_net INTEGER,
    away_penalty1_length INTEGER,
    away_penalty1_time_left INTEGER,
    away_skaters_on_ice INTEGER,
    away_team_code VARCHAR(10),
    away_team_goals INTEGER,
    
    -- Defending team time on ice stats
    defending_team_average_time_on_ice DECIMAL(10,4),
    defending_team_average_time_on_ice_of_defencemen DECIMAL(10,4),
    defending_team_average_time_on_ice_of_defencemen_since_faceoff DECIMAL(10,4),
    defending_team_average_time_on_ice_of_forwards DECIMAL(10,4),
    defending_team_average_time_on_ice_of_forwards_since_faceoff DECIMAL(10,4),
    defending_team_average_time_on_ice_since_faceoff DECIMAL(10,4),
    defending_team_defencemen_on_ice INTEGER,
    defending_team_forwards_on_ice INTEGER,
    defending_team_max_time_on_ice DECIMAL(10,4),
    defending_team_max_time_on_ice_of_defencemen DECIMAL(10,4),
    defending_team_max_time_on_ice_of_defencemen_since_faceoff DECIMAL(10,4),
    defending_team_max_time_on_ice_of_forwards DECIMAL(10,4),
    defending_team_max_time_on_ice_of_forwards_since_faceoff DECIMAL(10,4),
    defending_team_max_time_on_ice_since_faceoff DECIMAL(10,4),
    defending_team_min_time_on_ice DECIMAL(10,4),
    defending_team_min_time_on_ice_of_defencemen DECIMAL(10,4),
    defending_team_min_time_on_ice_of_defencemen_since_faceoff DECIMAL(10,4),
    defending_team_min_time_on_ice_of_forwards DECIMAL(10,4),
    defending_team_min_time_on_ice_of_forwards_since_faceoff DECIMAL(10,4),
    defending_team_min_time_on_ice_since_faceoff DECIMAL(10,4),
    
    -- Event details
    distance_from_last_event DECIMAL(10,4),
    event VARCHAR(50),
    game_over INTEGER,
    game_id INTEGER,
    goal INTEGER,
    goalie_id_for_shot INTEGER,
    goalie_name_for_shot VARCHAR(100),
    
    -- Home team info
    home_empty_net INTEGER,
    home_penalty1_length INTEGER,
    home_penalty1_time_left INTEGER,
    home_skaters_on_ice INTEGER,
    home_team_code VARCHAR(10),
    home_team_goals INTEGER,
    home_team_score INTEGER,
    home_team_won INTEGER,
    home_win_probability DECIMAL(10,6),
    
    -- General identifiers
    id INTEGER,
    is_home_team DECIMAL(10,4),
    is_playoff_game INTEGER,
    
    -- Last event details
    last_event_category VARCHAR(50),
    last_event_shot_angle DECIMAL(10,4),
    last_event_shot_distance DECIMAL(10,4),
    last_event_team VARCHAR(50),
    last_event_x_cord DECIMAL(10,4),
    last_event_x_cord_adjusted DECIMAL(10,4),
    last_event_y_cord DECIMAL(10,4),
    last_event_y_cord_adjusted DECIMAL(10,4),
    
    -- Location and position info
    location VARCHAR(50),
    off_wing INTEGER,
    penalty_length INTEGER,
    period INTEGER,
    player_num_that_did_event INTEGER,
    player_num_that_did_last_event INTEGER,
    player_position_that_did_event VARCHAR(10),
    playoff_game INTEGER,
    road_team_code VARCHAR(10),
    road_team_score INTEGER,
    season INTEGER,
    
    -- Shooter details
    shooter_left_right VARCHAR(10),
    shooter_name VARCHAR(100),
    shooter_player_id INTEGER,
    shooter_time_on_ice DECIMAL(10,4),
    shooter_time_on_ice_since_faceoff DECIMAL(10,4),
    
    -- Shooting team time on ice stats
    shooting_team_average_time_on_ice DECIMAL(10,4),
    shooting_team_average_time_on_ice_of_defencemen DECIMAL(10,4),
    shooting_team_average_time_on_ice_of_defencemen_since_faceoff DECIMAL(10,4),
    shooting_team_average_time_on_ice_of_forwards DECIMAL(10,4),
    shooting_team_average_time_on_ice_of_forwards_since_faceoff DECIMAL(10,4),
    shooting_team_average_time_on_ice_since_faceoff DECIMAL(10,4),
    shooting_team_defencemen_on_ice INTEGER,
    shooting_team_forwards_on_ice INTEGER,
    shooting_team_max_time_on_ice DECIMAL(10,4),
    shooting_team_max_time_on_ice_of_defencemen DECIMAL(10,4),
    shooting_team_max_time_on_ice_of_defencemen_since_faceoff DECIMAL(10,4),
    shooting_team_max_time_on_ice_of_forwards DECIMAL(10,4),
    shooting_team_max_time_on_ice_of_forwards_since_faceoff DECIMAL(10,4),
    shooting_team_max_time_on_ice_since_faceoff DECIMAL(10,4),
    shooting_team_min_time_on_ice DECIMAL(10,4),
    shooting_team_min_time_on_ice_of_defencemen DECIMAL(10,4),
    shooting_team_min_time_on_ice_of_defencemen_since_faceoff DECIMAL(10,4),
    shooting_team_min_time_on_ice_of_forwards DECIMAL(10,4),
    shooting_team_min_time_on_ice_of_forwards_since_faceoff DECIMAL(10,4),
    shooting_team_min_time_on_ice_since_faceoff DECIMAL(10,4),
    
    -- Shot analysis
    shot_angle DECIMAL(10,4),
    shot_angle_adjusted DECIMAL(10,4),
    shot_angle_plus_rebound DECIMAL(10,4),
    shot_angle_plus_rebound_speed DECIMAL(10,4),
    shot_angle_rebound_royal_road INTEGER,
    shot_distance DECIMAL(10,4),
    shot_generated_rebound INTEGER,
    shot_goal_probability DECIMAL(10,6),
    shot_goalie_froze INTEGER,
    shot_on_empty_net INTEGER,
    shot_play_continued INTEGER,
    shot_play_continued_in_zone INTEGER,
    shot_play_continued_outside_zone INTEGER,
    shot_play_stopped INTEGER,
    shot_rebound INTEGER,
    shot_rush INTEGER,
    shot_type VARCHAR(50),
    shot_was_on_goal DECIMAL(10,4),
    
    -- Timing and game state
    speed_from_last_event DECIMAL(10,4),
    team VARCHAR(50),
    team_code VARCHAR(10),
    time INTEGER,
    time_between_events DECIMAL(10,4),
    time_difference_since_change DECIMAL(10,4),
    time_left INTEGER,
    time_since_faceoff INTEGER,
    time_since_last_event DECIMAL(10,4),
    time_until_next_event DECIMAL(10,4),
    went_to_ot INTEGER,
    went_to_shootout INTEGER,
    
    -- Expected goals and coordinates
    x_cord DECIMAL(10,4),
    x_cord_adjusted DECIMAL(10,4),
    x_froze DECIMAL(10,6),
    x_goal DECIMAL(10,6),
    x_play_continued_in_zone DECIMAL(10,6),
    x_play_continued_outside_zone DECIMAL(10,6),
    x_play_stopped DECIMAL(10,6),
    x_rebound DECIMAL(10,6),
    x_shot_was_on_goal DECIMAL(10,6),
    y_cord DECIMAL(10,4),
    y_cord_adjusted DECIMAL(10,4),
    
    -- Add indexes for common queries
    PRIMARY KEY (shot_id),
    INDEX idx_game_id (game_id),
    INDEX idx_shooter_id (shooter_player_id),
    INDEX idx_team_code (team_code),
    INDEX idx_season (season),
    INDEX idx_period (period),
    INDEX idx_goal (goal),
    INDEX idx_shot_type (shot_type)
);

-- Add table comment
COMMENT ON TABLE nhl_shots_2024 IS 'NHL shot data for the 2024 season containing detailed shot metrics, player information, and expected goals data';
