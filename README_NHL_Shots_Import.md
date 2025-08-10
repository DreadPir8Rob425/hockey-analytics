# NHL Shots 2024 Supabase Import

This directory contains scripts to import NHL shots data for 2024 into a Supabase database.

## Files

- `create_shots_table.sql` - SQL script to create the table schema
- `import_shots_to_supabase.py` - Python script to import CSV data
- `setup_nhl_shots_supabase.sh` - Bash script that runs the complete setup process
- `README_NHL_Shots_Import.md` - This file

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Python 3**: With pip for installing packages
3. **CSV File**: `shots_2024.csv` should be in `/Users/jcar/Downloads/`

## Required Python Packages

The script will auto-install these, but you can install manually:
```bash
pip3 install pandas supabase numpy tqdm
```

## Setup Instructions

### 1. Set Environment Variables

Get your Supabase credentials:
1. Go to your Supabase dashboard
2. Select your project  
3. Go to Settings → API
4. Copy the Project URL and anon/public key

Then set them in your terminal:
```bash
export SUPABASE_URL='https://your-project-id.supabase.co'
export SUPABASE_ANON_KEY='your-anon-key-here'
```

### 2. Run the Setup Script

```bash
./setup_nhl_shots_supabase.sh
```

This will:
- Check prerequisites
- Create the `nhl_shots_2024` table
- Import all ~120K rows from the CSV file

## Manual Setup (Alternative)

If you prefer to run steps manually:

### Step 1: Create Table
Run the SQL from `create_shots_table.sql` in your Supabase SQL Editor.

### Step 2: Import Data
```bash
python3 import_shots_to_supabase.py
```

## Table Schema

The table `nhl_shots_2024` contains 137 columns including:

**Key Fields:**
- `shot_id` - Primary key
- `game_id` - Game identifier
- `shooter_name` - Player name
- `shooter_player_id` - Player ID
- `team_code` - Team abbreviation
- `goal` - Whether shot was a goal (1/0)
- `shot_type` - Type of shot (WRIST, SLAP, etc.)
- `x_goal` - Expected goals value
- `shot_distance` - Distance to goal
- `period` - Game period

**Coordinates:**
- `x_cord`, `y_cord` - Shot coordinates
- `arena_adjusted_x_cord`, `arena_adjusted_y_cord` - Adjusted coordinates

**Game State:**
- `home_team_code`, `away_team_code` - Team codes
- `time_left` - Time remaining in period
- `home_skaters_on_ice`, `away_skaters_on_ice` - Player counts

## Example Queries

### Goals by Team
```sql
SELECT team_code, COUNT(*) as goals
FROM nhl_shots_2024
WHERE goal = 1
GROUP BY team_code
ORDER BY goals DESC;
```

### Top Shot Takers
```sql
SELECT shooter_name, COUNT(*) as shots, SUM(goal) as goals
FROM nhl_shots_2024
GROUP BY shooter_name
ORDER BY shots DESC
LIMIT 10;
```

### Expected Goals Analysis
```sql
SELECT team_code, 
       COUNT(*) as shots,
       SUM(goal) as actual_goals,
       ROUND(SUM(x_goal), 2) as expected_goals,
       ROUND(SUM(goal) - SUM(x_goal), 2) as goals_above_expected
FROM nhl_shots_2024
GROUP BY team_code
ORDER BY goals_above_expected DESC;
```

### Shot Types Distribution
```sql
SELECT shot_type, 
       COUNT(*) as attempts,
       SUM(goal) as goals,
       ROUND(AVG(x_goal), 3) as avg_xg,
       ROUND(100.0 * SUM(goal) / COUNT(*), 1) as goal_percentage
FROM nhl_shots_2024
GROUP BY shot_type
ORDER BY attempts DESC;
```

## Troubleshooting

**Environment Variables**: Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly.

**Python Dependencies**: If packages fail to install, try:
```bash
pip3 install --user pandas supabase numpy tqdm
```

**Large Dataset**: The import processes ~120K rows in batches. It may take 5-10 minutes.

**Memory Issues**: If you encounter memory issues, you can modify the batch size in `import_shots_to_supabase.py` (default is 1000 rows per batch).

## Data Source

This dataset contains NHL shot data for the 2024 season with detailed metrics including:
- Shot location and distance
- Expected goals calculations  
- Game state information
- Player and team details
- Time-on-ice statistics

Perfect for hockey analytics, expected goals modeling, and shot quality analysis!
