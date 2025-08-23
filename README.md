# Cold Hard Puck

A comprehensive hockey analytics web application built with Next.js, TypeScript, and D3.js. This platform provides interactive visualizations, detailed statistics, and insights for players, teams, and games.

## Features

**Interactive Dashboard**
- Overview of key hockey statistics and trends
- Real-time data visualization and analysis

**Advanced Visualizations**
- Player performance charts (bar charts, radar charts)
- Team comparison analytics
- Seasonal trends and patterns
- Hockey rink shot charts with D3.js
- Interactive stat tooltips with contextual explanations

**Comprehensive Analytics**
- Advanced hockey metrics (Corsi, Fenwick, PDO, Expected Goals)
- Situational statistics (5v5, Power Play, Penalty Kill)
- Team-specific color theming and branding
- Period-by-period breakdowns

**Modern Architecture**
- TypeScript interfaces for players, teams, games, and statistics
- Responsive design with mobile-first approach
- Component-based architecture with reusable UI elements

## Technology Stack

**Core Framework**
- Next.js 15 with App Router
- React 19
- TypeScript

**Styling & UI**
- Tailwind CSS
- Custom team color system
- Responsive design patterns

**Data Visualization**
- Recharts for standard charts
- D3.js for custom interactive visualizations
- Interactive tooltip system

**Data Processing**
- Lodash utilities
- date-fns for date manipulation
- PapaParse for CSV handling

## Key Components

**Chart Components**
- PlayerPerformanceChart: Bar chart showing goals and assists for top players
- TeamComparisonChart: Radar chart comparing team statistics
- GameTrendsChart: Area chart displaying seasonal trends
- HockeyRinkChart: Custom D3.js visualization of shot locations on hockey rink
- StatsCard: Reusable metric cards with trend indicators

**Interactive Features**
- StatTooltip: Contextual explanations for hockey statistics
- TeamComponents: Color-themed team badges, headers, and stat bars
- Navigation: Responsive navigation with active state management

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/
│   ├── charts/          # Chart components (Recharts & D3)
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Navigation and layout components
│   └── ui/              # Reusable UI components
├── lib/
│   └── utils.ts         # Utility functions for hockey analytics
├── types/
│   └── hockey.ts        # TypeScript type definitions
├── data/
│   └── sampleData.ts    # Sample hockey data and mock API
data-migrations/
├── scripts/             # Python data import scripts
├── docs/                # Data schema documentation
├── requirements.txt     # Python dependencies
├── setup.sh            # Environment setup script
└── README.md           # Data migration guide
```

## Data Models

**Core Types**
- Player: Basic player information and attributes
- PlayerStats: Detailed performance statistics
- Team: Team information and metadata
- TeamStats: Team performance metrics
- Game: Game information and results
- GameEvent: Individual game events and plays
- PlayerAnalytics: Advanced statistics (Corsi, Fenwick, PDO)

## Analytics Capabilities

**Standard Metrics**
- Points per game calculations
- Shooting and save percentages
- Power play and penalty kill statistics
- Faceoff win percentages

**Advanced Analytics**
- Corsi and Fenwick percentages
- PDO calculations
- Expected Goals (xG) modeling
- Goal differential analysis
- Time on ice tracking
- Situational performance breakdowns

## Utility Functions

Specialized hockey analytics functions in `utils.ts`:
- Statistical calculations (shooting %, save %, point %)
- Data formatting and time conversions
- Sorting and filtering utilities
- Color palette generation for charts
- Advanced metric calculations

## Design System

**Styling Framework**
- Tailwind CSS utility-first approach
- Custom team color system with CSS variables
- Responsive design patterns

**UI Components**
- Reusable component library
- Interactive elements with hover effects and transitions
- Contextual tooltip system
- Team-branded visual elements

## Development Setup

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Dependencies

**Core Dependencies**
- next: React framework
- react & react-dom: React library
- typescript: Type safety
- tailwindcss: Styling framework

**Visualization Libraries**
- d3: Advanced data visualization
- recharts: React chart library
- @types/d3: TypeScript definitions for D3

**Utility Libraries**
- lodash: Utility functions
- date-fns: Date manipulation
- papaparse: CSV parsing
- clsx & tailwind-merge: CSS class utilities

## Sample Data

The application includes comprehensive sample data for development:
- 5 top NHL players with realistic statistics
- 4 NHL teams with performance metrics
- Sample games with results and metadata
- Mock API functions for development testing

## Getting Started

**Frontend Development**
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Explore the dashboard at `http://localhost:3000`
5. Navigate through sections: Players, Teams, Games, Statistics, Analysis

**Data Migration (Optional)**
For working with real NHL data:
1. Navigate to data migrations: `cd data-migrations`
2. Run setup script: `./setup.sh`
3. Configure Supabase credentials in `.env` file
4. Run migration script of your choice
5. See [data-migrations/README.md](./data-migrations/README.md) for detailed instructions

## Data Integration

The application supports flexible data integration:
- NHL API integration ready
- Flexible data models
- Mock API structure for easy replacement
- CSV import capabilities with PapaParse

## Future Development

**Planned Features**
- Real-time game data integration
- Player comparison tools
- Season-over-season analysis
- Export functionality for reports
- Advanced filtering and search
- Team roster management
- Playoff bracket visualization
- Fantasy hockey integration

## Contributing

This project serves as a foundation for hockey analytics applications. Contributions are welcome for additional features, charts, or data sources.

## License

MIT License - Open source project for hockey analytics and data visualization development.
