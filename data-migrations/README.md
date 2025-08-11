# Data Migration Scripts

## 🚨 CRITICAL SECURITY WARNING

**ALL HARDCODED CREDENTIALS HAVE BEEN REMOVED FOR SECURITY**

- **Scripts now require environment variables for Supabase credentials**
- **Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` before running any script**
- **Never commit credentials to version control**

```bash
# Required environment variables:
export SUPABASE_URL="your-supabase-project-url"
export SUPABASE_ANON_KEY="your-supabase-anon-key"
```

This folder contains Python scripts for importing NHL shot data from CSV files into Supabase database. The scripts handle data cleaning, column mapping (camelCase to snake_case), and batch uploading.

## 📁 Directory Structure

```
data-migrations/
├── scripts/                    # Python import scripts
│   ├── clear_and_import.py    # Clear existing data and run full import
│   ├── import_final.py        # Final import with duplicate handling
│   ├── import_now.py          # Simple import with embedded credentials
│   ├── import_shots_to_supabase.py  # Environment-based import
│   └── quick_import.py        # Quick import with user input
├── docs/                      # Documentation
├── data/                      # Raw data files (CSV)
├── create_shots_table.sql     # SQLite table schema
├── create_shots_table_postgres.sql  # PostgreSQL/Supabase table schema
└── README.md                  # This file
```

## 🚀 Scripts Overview

### 1. `clear_and_import.py` ⚠️ **DESTRUCTIVE**
- **Purpose**: Clears existing data and performs full import
- **Use Case**: Fresh start or complete data refresh
- **Features**:
  - Deletes all existing records
  - Full CSV import with progress tracking
  - Batch processing (500 records per batch)
  - ETA calculations

### 2. `import_final.py`
- **Purpose**: Production-ready import with duplicate handling
- **Use Case**: Final import for production deployment
- **Features**:
  - Removes duplicate shot_id records
  - Full error handling
  - Progress tracking with success count

### 3. `import_now.py`
- **Purpose**: Simple import with hardcoded credentials
- **Use Case**: Quick testing and development
- **Features**:
  - Auto-installs required packages
  - Embedded Supabase credentials
  - Basic error handling

### 4. `import_shots_to_supabase.py`
- **Purpose**: Professional import using environment variables
- **Use Case**: Production deployments with secure credentials
- **Features**:
  - Environment variable configuration
  - Comprehensive logging
  - Data type validation
  - Progress bars with tqdm

### 5. `quick_import.py`
- **Purpose**: Interactive import with user input
- **Use Case**: One-time imports with manual credential entry
- **Features**:
  - Interactive credential input
  - Auto package installation
  - Batch processing (1000 records per batch)

## 🔧 Prerequisites

### Required Python Packages
```bash
pip install pandas supabase numpy tqdm
```

### Required Data
- NHL shots 2024 CSV file at: `data/shots_2024.csv` (included)
- Supabase database with `nhl_shots_2024` table

### Database Setup
Use the provided SQL schema files to create the required table:

**For Supabase (PostgreSQL):**
```bash
# Run this SQL in your Supabase SQL editor
psql -f create_shots_table_postgres.sql
```

**For SQLite (local development):**
```bash
sqlite3 hockey.db < create_shots_table.sql
```

### Supabase Configuration
You need:
- **Supabase URL**: Your project URL
- **Supabase Anon Key**: Your project's anon/public key

## 📊 Data Schema

The scripts handle extensive column mapping from camelCase to snake_case:

### Key Columns Mapped:
- `shotID` → `shot_id`
- `arenaAdjustedShotDistance` → `arena_adjusted_shot_distance`
- `shooterName` → `shooter_name`
- `goalieNameForShot` → `goalie_name_for_shot`
- `homeTeamCode` → `home_team_code`
- `awayTeamCode` → `away_team_code`
- ... (150+ column mappings)

### Data Cleaning:
- NaN values → NULL
- Empty strings → NULL  
- Numeric type validation
- Duplicate removal (where applicable)

## 🎯 Usage Instructions

### For Development/Testing:
```bash
cd /Users/jcar/source/hockey-analytics/data-migrations/scripts
python3 import_now.py
```

### For Production (Recommended):
1. Set environment variables:
   ```bash
   export SUPABASE_URL='https://your-project.supabase.co'
   export SUPABASE_ANON_KEY='your-anon-key-here'
   ```

2. Run the script:
   ```bash
   python3 import_shots_to_supabase.py
   ```

### For Complete Refresh:
⚠️ **WARNING**: This will delete all existing data
```bash
python3 clear_and_import.py
```

### For Final Import:
```bash
python3 import_final.py
```

## 📈 Performance Notes

- **Batch Sizes**:
  - `clear_and_import.py`: 500 records/batch
  - `import_final.py`: 500 records/batch  
  - `quick_import.py`: 1000 records/batch
  - `import_shots_to_supabase.py`: 1000 records/batch

- **Estimated Time**: 
  - ~10-15 minutes for full dataset (~500K+ records)
  - Progress tracking available in most scripts

## ⚠️ Security Considerations

### Credential Management:
- ✅ **Good**: `import_shots_to_supabase.py` (environment variables)
- ⚠️ **Caution**: Other scripts have embedded credentials
- 🔒 **Recommendation**: Use environment variables in production

### Data Handling:
- Scripts handle sensitive database operations
- Always test with small datasets first
- Keep backups before running destructive operations

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing CSV file"**
   - Ensure `/Users/jcar/Downloads/shots_2024.csv` exists
   - Update file path in scripts if needed

2. **"Column mismatch errors"**
   - Check Supabase table schema matches expected columns
   - Verify column mapping in scripts

3. **"Connection refused"**
   - Verify Supabase URL and credentials
   - Check network connectivity

4. **"Duplicate key errors"**
   - Use `import_final.py` which handles duplicates
   - Or clear existing data first

### Debug Mode:
Add this to any script for detailed logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📝 Script Selection Guide

| Use Case | Recommended Script | Notes |
|----------|-------------------|-------|
| First time setup | `import_shots_to_supabase.py` | Most robust |
| Development testing | `import_now.py` | Quick and simple |
| Production deployment | `import_shots_to_supabase.py` | Environment variables |
| Data refresh | `clear_and_import.py` | Destructive - use carefully |
| Handle duplicates | `import_final.py` | Built-in deduplication |
| Interactive setup | `quick_import.py` | Manual credential input |

## 🔄 Migration History

Track your migrations by adding entries here:

```
[Date] - [Script Used] - [Records Imported] - [Notes]
Example:
2024-01-15 - import_final.py - 543,210 records - Initial production import
```

## 📚 Related Documentation

- [Supabase Python Client](https://github.com/supabase-community/supabase-py)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [NHL Data Schema](../docs/data-schema.md) (if available)

## 🗄️ Database Schema Files

### `create_shots_table.sql`
- **Purpose**: SQLite table schema for local development
- **Use Case**: Setting up local SQLite database for testing
- **Features**: Complete table structure with all 150+ columns

### `create_shots_table_postgres.sql` 
- **Purpose**: PostgreSQL/Supabase table schema for production
- **Use Case**: Setting up production Supabase database
- **Features**: PostgreSQL-optimized schema with proper data types

**Usage:**
1. Copy the SQL content from the appropriate schema file
2. Run it in your database management tool (Supabase SQL Editor, pgAdmin, etc.)
3. Verify the `nhl_shots_2024` table is created with all expected columns
