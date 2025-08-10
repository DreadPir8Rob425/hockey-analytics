# NHL Shots Data Schema

This document describes the data schema for NHL shot data imported from CSV files.

## Table: `nhl_shots_2024`

### Primary Identification
| Column | Type | Description |
|--------|------|-------------|
| `shot_id` | INTEGER | Unique identifier for each shot |
| `game_id` | INTEGER | Unique identifier for the game |

### Basic Shot Information
| Column | Type | Description |
|--------|------|-------------|
| `shooter_name` | TEXT | Name of the player taking the shot |
| `shooter_player_id` | INTEGER | Unique player identifier |
| `shooter_left_right` | TEXT | Player's shooting hand (L/R) |
| `shot_type` | TEXT | Type of shot (Wrist, Slap, Snap, etc.) |
| `shot_distance` | REAL | Distance of shot from goal |
| `shot_angle` | REAL | Angle of shot relative to goal |
| `shot_angle_adjusted` | REAL | Arena-adjusted shot angle |

### Shot Location (Coordinates)
| Column | Type | Description |
|--------|------|-------------|
| `x_cord` | REAL | X-coordinate of shot location |
| `y_cord` | REAL | Y-coordinate of shot location |
| `x_cord_adjusted` | REAL | Arena-adjusted X-coordinate |
| `y_cord_adjusted` | REAL | Arena-adjusted Y-coordinate |
| `arena_adjusted_x_cord` | REAL | Arena-adjusted X-coordinate |
| `arena_adjusted_y_cord` | REAL | Arena-adjusted Y-coordinate |
| `arena_adjusted_x_cord_abs` | REAL | Absolute arena-adjusted X-coordinate |
| `arena_adjusted_y_cord_abs` | REAL | Absolute arena-adjusted Y-coordinate |

### Shot Outcome
| Column | Type | Description |
|--------|------|-------------|
| `shot_was_on_goal` | BOOLEAN | Whether shot was on target |
| `shot_goal_probability` | REAL | Expected goal probability (xG) |
| `shot_generated_rebound` | BOOLEAN | Whether shot generated a rebound |
| `shot_on_empty_net` | BOOLEAN | Whether shot was on empty net |

### Expected Goals (xG) Models
| Column | Type | Description |
|--------|------|-------------|
| `x_goal` | REAL | Expected goal probability |
| `x_shot_was_on_goal` | REAL | Expected probability shot was on goal |
| `x_rebound` | REAL | Expected rebound probability |
| `x_froze` | REAL | Expected probability goalie froze puck |
| `x_play_continued_in_zone` | REAL | Expected probability play continued in zone |
| `x_play_continued_outside_zone` | REAL | Expected probability play continued outside zone |
| `x_play_stopped` | REAL | Expected probability play stopped |

### Game Context
| Column | Type | Description |
|--------|------|-------------|
| `home_team_code` | TEXT | Home team abbreviation |
| `away_team_code` | TEXT | Away team abbreviation |
| `road_team_code` | TEXT | Road team abbreviation |
| `team_code` | TEXT | Shooting team abbreviation |
| `is_home_team` | BOOLEAN | Whether shooting team is home team |
| `is_playoff_game` | BOOLEAN | Whether game is playoff game |
| `playoff_game` | BOOLEAN | Whether game is playoff game |

### Score Context
| Column | Type | Description |
|--------|------|-------------|
| `home_team_score` | INTEGER | Home team score at time of shot |
| `road_team_score` | INTEGER | Road team score at time of shot |
| `home_team_goals` | INTEGER | Home team goals |
| `away_team_goals` | INTEGER | Away team goals |
| `home_team_won` | BOOLEAN | Whether home team won |
| `home_win_probability` | REAL | Home team win probability at time of shot |

### Time Context
| Column | Type | Description |
|--------|------|-------------|
| `time_left` | REAL | Time left in period (seconds) |
| `time_since_faceoff` | REAL | Time since last faceoff |
| `time_since_last_event` | REAL | Time since previous event |
| `time_until_next_event` | REAL | Time until next event |
| `time_between_events` | REAL | Time between this and previous event |

### Special Teams Context
| Column | Type | Description |
|--------|------|-------------|
| `home_skaters_on_ice` | INTEGER | Number of home skaters on ice |
| `away_skaters_on_ice` | INTEGER | Number of away skaters on ice |
| `home_empty_net` | BOOLEAN | Whether home team has empty net |
| `away_empty_net` | BOOLEAN | Whether away team has empty net |
| `home_penalty1_length` | REAL | Length of home team penalty |
| `away_penalty1_length` | REAL | Length of away team penalty |
| `home_penalty1_time_left` | REAL | Time left on home penalty |
| `away_penalty1_time_left` | REAL | Time left on away penalty |

### Goalie Information
| Column | Type | Description |
|--------|------|-------------|
| `goalie_id_for_shot` | INTEGER | Goalie player ID |
| `goalie_name_for_shot` | TEXT | Goalie name |

### Previous Event Context
| Column | Type | Description |
|--------|------|-------------|
| `last_event_category` | TEXT | Type of previous event |
| `last_event_team` | TEXT | Team that had previous event |
| `last_event_x_cord` | REAL | X-coordinate of previous event |
| `last_event_y_cord` | REAL | Y-coordinate of previous event |
| `last_event_x_cord_adjusted` | REAL | Adjusted X-coordinate of previous event |
| `last_event_y_cord_adjusted` | REAL | Adjusted Y-coordinate of previous event |
| `last_event_shot_angle` | REAL | Angle of previous shot event |
| `last_event_shot_distance` | REAL | Distance of previous shot event |
| `distance_from_last_event` | REAL | Distance from previous event location |
| `speed_from_last_event` | REAL | Speed from previous event |

### Player Context
| Column | Type | Description |
|--------|------|-------------|
| `player_num_that_did_event` | INTEGER | Jersey number of shooting player |
| `player_position_that_did_event` | TEXT | Position of shooting player |
| `player_num_that_did_last_event` | INTEGER | Jersey number from previous event |
| `shooter_time_on_ice` | REAL | Shooter's time on ice |
| `shooter_time_on_ice_since_faceoff` | REAL | Shooter's TOI since faceoff |
| `off_wing` | BOOLEAN | Whether shooter is on off-wing |

### Team Time on Ice - Shooting Team
| Column | Type | Description |
|--------|------|-------------|
| `shooting_team_forwards_on_ice` | INTEGER | Number of forwards on ice |
| `shooting_team_defencemen_on_ice` | INTEGER | Number of defensemen on ice |
| `shooting_team_average_time_on_ice` | REAL | Average TOI for skaters |
| `shooting_team_max_time_on_ice` | REAL | Maximum TOI for any skater |
| `shooting_team_min_time_on_ice` | REAL | Minimum TOI for any skater |
| `shooting_team_average_time_on_ice_since_faceoff` | REAL | Average TOI since faceoff |
| `shooting_team_max_time_on_ice_since_faceoff` | REAL | Max TOI since faceoff |
| `shooting_team_min_time_on_ice_since_faceoff` | REAL | Min TOI since faceoff |

### Team Time on Ice - Defending Team
| Column | Type | Description |
|--------|------|-------------|
| `defending_team_forwards_on_ice` | INTEGER | Number of forwards on ice |
| `defending_team_defencemen_on_ice` | INTEGER | Number of defensemen on ice |
| `defending_team_average_time_on_ice` | REAL | Average TOI for skaters |
| `defending_team_max_time_on_ice` | REAL | Maximum TOI for any skater |
| `defending_team_min_time_on_ice` | REAL | Minimum TOI for any skater |
| `defending_team_average_time_on_ice_since_faceoff` | REAL | Average TOI since faceoff |
| `defending_team_max_time_on_ice_since_faceoff` | REAL | Max TOI since faceoff |
| `defending_team_min_time_on_ice_since_faceoff` | REAL | Min TOI since faceoff |

### Position-Specific Time on Ice
| Column | Type | Description |
|--------|------|-------------|
| `shooting_team_average_time_on_ice_of_forwards` | REAL | Avg forward TOI |
| `shooting_team_average_time_on_ice_of_defencemen` | REAL | Avg defenseman TOI |
| `defending_team_average_time_on_ice_of_forwards` | REAL | Avg forward TOI |
| `defending_team_average_time_on_ice_of_defencemen` | REAL | Avg defenseman TOI |

### Advanced Shot Context
| Column | Type | Description |
|--------|------|-------------|
| `shot_rebound` | BOOLEAN | Whether this shot was a rebound |
| `shot_rush` | BOOLEAN | Whether shot was on a rush |
| `shot_angle_plus_rebound` | REAL | Shot angle including rebound context |
| `shot_angle_plus_rebound_speed` | REAL | Shot angle with rebound speed |
| `shot_angle_rebound_royal_road` | REAL | Shot angle with royal road context |

### Play Continuation
| Column | Type | Description |
|--------|------|-------------|
| `shot_play_continued` | BOOLEAN | Whether play continued after shot |
| `shot_play_continued_in_zone` | BOOLEAN | Play continued in offensive zone |
| `shot_play_continued_outside_zone` | BOOLEAN | Play continued outside zone |
| `shot_play_stopped` | BOOLEAN | Whether play stopped after shot |
| `shot_goalie_froze` | BOOLEAN | Whether goalie froze puck |

### Game State
| Column | Type | Description |
|--------|------|-------------|
| `game_over` | BOOLEAN | Whether game was over |
| `went_to_ot` | BOOLEAN | Whether game went to overtime |
| `went_to_shootout` | BOOLEAN | Whether game went to shootout |
| `average_rest_difference` | REAL | Rest difference between teams |
| `time_difference_since_change` | REAL | Time since line change |

## Data Types Summary

- **INTEGER**: Whole numbers (IDs, counts, scores)
- **REAL**: Decimal numbers (coordinates, probabilities, times)
- **TEXT**: String values (names, codes, categories)
- **BOOLEAN**: True/false values

## Key Relationships

1. **Shot → Game**: Each shot belongs to one game (`game_id`)
2. **Shot → Player**: Each shot taken by one player (`shooter_player_id`)
3. **Shot → Goalie**: Each shot faced by one goalie (`goalie_id_for_shot`)
4. **Shot → Teams**: Each shot involves home/away teams

## Data Quality Notes

- NaN/NULL values handled appropriately for optional fields
- Coordinate system is standardized across all arenas
- Time values are in seconds unless otherwise specified
- Probabilities are decimal values between 0 and 1
- Boolean values are stored as 0/1 in database
