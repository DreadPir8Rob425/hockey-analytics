# Hockey Analytics Data Import

This directory contains scripts to import hockey game data from CSV files into a Supabase database.

## Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and fill in your Supabase credentials:
   - `SUPABASE_URL`: Your Supabase project URL (from Settings > API)
   - `SUPABASE_SERVICE_KEY`: Your service role key (from Settings > API)
   - `SUPABASE_DB_PASSWORD`: Your database password

### 3. Create the Database Table

Run the SQL script in your Supabase SQL editor:
```sql
-- Copy and paste the contents of create_games_table.sql
```

## Usage

### Import Data

Make sure your `DAL.csv` file is in the same directory as the script, then run:

```bash
python import_games_data.py
```

The script will:
- Connect to your Supabase database
- Load and process the CSV data
- Convert column names to match the database schema
- Convert date formats
- Import data in batches (500 rows at a time by default)
- Handle duplicate records using upsert logic

### Alternative: Using Environment Variables Directly

You can also set environment variables directly in your shell:

```bash
export SUPABASE_URL='https://your-project-ref.supabase.co'
export SUPABASE_SERVICE_KEY='your-service-role-key'
export SUPABASE_DB_PASSWORD='your-db-password'

python import_games_data.py
```

## Files

- `create_games_table.sql`: SQL script to create the games table
- `import_games_data.py`: Python script to import CSV data
- `requirements.txt`: Python dependencies
- `.env.example`: Example environment variables file
- `DAL.csv`: Your data file (should be in this directory)

## Features

- **Automatic column mapping**: Converts camelCase CSV columns to snake_case database columns
- **Date conversion**: Converts YYYYMMDD format to proper SQL dates
- **Batch processing**: Imports data in configurable batches for better performance
- **Upsert logic**: Handles duplicate records by updating existing ones
- **Error handling**: Comprehensive logging and error handling
- **Data validation**: Handles NULL values and data type conversions

## Troubleshooting

### Common Issues

1. **Connection Error**: 
   - Verify your Supabase credentials are correct
   - Make sure your database password is correct
   - Check that your project reference in the URL is correct

2. **CSV File Not Found**:
   - Ensure `DAL.csv` is in the same directory as the script
   - Check the file name spelling

3. **Column Mismatch Errors**:
   - Make sure you've run the `create_games_table.sql` script first
   - Verify the table was created successfully in Supabase

4. **Permission Errors**:
   - Ensure you're using the service role key, not the anon key
   - The service role key should have full database access

### Logging

The script provides detailed logging output to help debug any issues. Look for:
- Connection status messages
- Row count information
- Batch processing progress
- Any error messages with details

## Data Schema

The `games` table includes:
- Basic game information (team, date, opponent, etc.)
- Expected goals and advanced analytics
- Shot attempts and success rates
- Special situations data (5on5, 4on5, etc.)
- Comprehensive offensive and defensive statistics

See `create_games_table.sql` for the complete schema definition.
