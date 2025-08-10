# Hockey Analytics Dashboard

A comprehensive React web application built with Next.js, TypeScript, and D3.js for analyzing hockey performance data. This analytics platform provides interactive visualizations, detailed statistics, and insights for players, teams, and games.

## 🏒 Features

- **Interactive Dashboard**: Overview of key hockey statistics and trends
- **Advanced Visualizations**: 
  - Player performance charts (bar charts, radar charts)
  - Team comparison analytics
  - Seasonal trends and patterns
  - Hockey rink shot charts with D3.js
- **Comprehensive Data Models**: TypeScript interfaces for players, teams, games, and statistics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, D3.js, Recharts
- **Sample Data**: Pre-loaded with realistic hockey data for development and testing

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: 
  - Recharts for standard charts
  - D3.js for custom interactive visualizations
- **Data Processing**: Lodash, date-fns, PapaParse for CSV handling
- **Development**: ESLint, Modern React patterns

## 📊 Chart Components

1. **PlayerPerformanceChart**: Bar chart showing goals and assists for top players
2. **TeamComparisonChart**: Radar chart comparing team statistics
3. **GameTrendsChart**: Area chart displaying seasonal trends
4. **HockeyRinkChart**: Custom D3.js visualization of shot locations on hockey rink
5. **StatsCard**: Reusable metric cards with trend indicators

## 🗂️ Project Structure

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

## 🎯 Key Data Types

- **Player**: Basic player information and attributes
- **PlayerStats**: Detailed performance statistics
- **Team**: Team information and metadata
- **TeamStats**: Team performance metrics
- **Game**: Game information and results
- **GameEvent**: Individual game events and plays
- **PlayerAnalytics**: Advanced statistics (Corsi, Fenwick, PDO)

## 📈 Analytics Features

- Points per game calculations
- Shooting and save percentages
- Power play and penalty kill statistics
- Advanced metrics (Corsi, Fenwick, PDO)
- Goal differential analysis
- Time on ice tracking
- Faceoff win percentages

## 🛠️ Utility Functions

The `utils.ts` file includes specialized hockey analytics functions:
- Statistical calculations (shooting %, save %, point %)
- Data formatting and time conversions
- Sorting and filtering utilities
- Color palette generation for charts
- Advanced metric calculations

## 🎨 Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Built-in dark mode support
- **Responsive**: Mobile-first responsive design
- **Component Library**: Reusable UI components
- **Interactive Elements**: Hover effects, transitions, tooltips

## 🏗️ Development Setup

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Dependencies

### Core Dependencies
- `next`: React framework
- `react` & `react-dom`: React library
- `typescript`: Type safety
- `tailwindcss`: Styling framework

### Visualization Libraries
- `d3`: Advanced data visualization
- `recharts`: React chart library
- `@types/d3`: TypeScript definitions for D3

### Utility Libraries
- `lodash`: Utility functions
- `date-fns`: Date manipulation
- `papaparse`: CSV parsing
- `clsx` & `tailwind-merge`: CSS class utilities

## 🎮 Sample Data

The application includes comprehensive sample data:
- **5 Top NHL Players** with realistic statistics
- **4 NHL Teams** with performance metrics
- **Sample Games** with results and metadata
- **Mock API Functions** for development testing

## 🚦 Getting Started

### Frontend Development
1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm run dev`
4. **Explore the dashboard** at `http://localhost:3000`
5. **Check out different sections**: Players, Teams, Games, Statistics, Analysis

### Data Migration (Optional)
For working with real NHL data:
1. **Navigate to data migrations**: `cd data-migrations`
2. **Run setup script**: `./setup.sh`
3. **Configure Supabase credentials** in `.env` file
4. **Run migration script** of your choice
5. **See [data-migrations/README.md](./data-migrations/README.md)** for detailed instructions

## 📊 Data Integration

The application is designed to easily integrate with real hockey APIs:
- NHL API integration ready
- Flexible data models
- Mock API structure for easy replacement
- CSV import capabilities with PapaParse

## 🎯 Future Enhancements

- Real-time game data integration
- Player comparison tools
- Season-over-season analysis
- Export functionality for reports
- Advanced filtering and search
- Team roster management
- Playoff bracket visualization
- Fantasy hockey integration

## 🤝 Contributing

This project serves as a comprehensive foundation for hockey analytics applications. Feel free to extend it with additional features, charts, or data sources.

## 📄 License

Open source project for hockey analytics and data visualization development.
