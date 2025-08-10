# Data Files

This directory contains the raw data files used for migration to the database.

## Files

### `shots_2024.csv`
- **Size**: ~69MB
- **Records**: ~500,000+ NHL shot records
- **Season**: 2023-24 NHL season
- **Description**: Comprehensive shot data including:
  - Shot locations and coordinates
  - Player and team information
  - Game context and score situations
  - Time on ice data
  - Expected goals (xG) models
  - Advanced analytics

### Data Schema
The CSV contains 150+ columns with detailed shot-level data. See `../docs/data-schema.md` for complete field documentation.

### Usage
All migration scripts in `../scripts/` will automatically use this file. The default path is:
```
data-migrations/data/shots_2024.csv
```

### File Management
- This file is excluded from git (.gitignore)
- Keep this file for future migrations and testing
- Original source: NHL shot data export

### Sample Data Preview
```
shotID,game_id,shooterName,teamCode,homeTeamCode,awayTeamCode,...
2024000001,2024020001,Connor McDavid,EDM,EDM,TOR,...
2024000002,2024020001,Auston Matthews,TOR,EDM,TOR,...
...
```

## Adding New Data Files

When adding new data files to this directory:

1. Follow naming convention: `[dataset]_[year].csv`
2. Update this README with file details
3. Ensure files are added to `.gitignore` if they contain sensitive data
4. Create corresponding migration script if needed
