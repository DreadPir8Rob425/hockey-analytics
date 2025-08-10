#!/bin/bash

# NHL Shots 2024 Supabase Setup Script
# This script creates the table and imports CSV data into Supabase

set -e  # Exit on any error

echo "🏒 NHL Shots 2024 Supabase Setup Script"
echo "======================================="

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Please set the following environment variables:"
    echo "  export SUPABASE_URL='https://your-project.supabase.co'"
    echo "  export SUPABASE_ANON_KEY='your-anon-key'"
    echo ""
    echo "You can find these values in your Supabase project settings:"
    echo "  - Go to your Supabase dashboard"
    echo "  - Select your project"
    echo "  - Go to Settings > API"
    echo "  - Copy the Project URL and anon/public key"
    exit 1
fi

# Check if CSV file exists
CSV_FILE="/Users/jcar/Downloads/shots_2024.csv"
if [ ! -f "$CSV_FILE" ]; then
    echo "❌ Error: CSV file not found at $CSV_FILE"
    echo "Please ensure the shots_2024.csv file is in your Downloads folder"
    exit 1
fi

echo "✅ Environment variables found"
echo "✅ CSV file found: $CSV_FILE"

# Check if required Python packages are installed
echo "📦 Checking Python dependencies..."

python3 -c "import pandas, supabase, numpy, tqdm" 2>/dev/null || {
    echo "❌ Missing required Python packages. Installing..."
    pip3 install pandas supabase numpy tqdm
}

echo "✅ Python dependencies ready"

# Step 1: Create table using Supabase CLI (if available) or manual SQL
echo ""
echo "🗃️  Step 1: Create database table"
echo "================================"

if command -v supabase &> /dev/null; then
    echo "Using Supabase CLI to create table..."
    supabase db push --db-url "$SUPABASE_URL" --file create_shots_table.sql
else
    echo "⚠️  Supabase CLI not found. Please manually run the SQL from create_shots_table.sql"
    echo "   You can run this in your Supabase SQL editor:"
    echo "   1. Go to your Supabase dashboard"
    echo "   2. Navigate to SQL Editor"
    echo "   3. Copy and paste the contents of create_shots_table.sql"
    echo "   4. Execute the query"
    echo ""
    echo "   Alternatively, install Supabase CLI:"
    echo "   npm install -g supabase"
    echo ""
    read -p "Press Enter after you've created the table manually, or Ctrl+C to exit..."
fi

echo "✅ Table creation step completed"

# Step 2: Import data
echo ""
echo "📥 Step 2: Import CSV data"
echo "========================="
echo "Starting data import... This may take several minutes for ~120K rows"

python3 import_shots_to_supabase.py

echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
echo "Your NHL shots data is now available in Supabase table: nhl_shots_2024"
echo ""
echo "Example queries you can run:"
echo "  -- Get goals by team"
echo "  SELECT team_code, COUNT(*) as goals"
echo "  FROM nhl_shots_2024"
echo "  WHERE goal = 1"
echo "  GROUP BY team_code"
echo "  ORDER BY goals DESC;"
echo ""
echo "  -- Get shot attempts by player"
echo "  SELECT shooter_name, COUNT(*) as shots, SUM(goal) as goals"
echo "  FROM nhl_shots_2024"
echo "  GROUP BY shooter_name"
echo "  ORDER BY shots DESC"
echo "  LIMIT 10;"
echo ""
echo "  -- Expected goals vs actual goals by team"
echo "  SELECT team_code, "
echo "         COUNT(*) as shots,"
echo "         SUM(goal) as actual_goals,"
echo "         ROUND(SUM(x_goal), 2) as expected_goals"
echo "  FROM nhl_shots_2024"
echo "  GROUP BY team_code"
echo "  ORDER BY expected_goals DESC;"
