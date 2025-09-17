'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import InteractiveHockeyHeatMap from '@/components/charts/InteractiveHockeyHeatMap';

// Define the CSV data type
interface CSVShotData {
  shotID?: string;
  game_id?: string;
  xCord?: number;
  yCord?: number;
  xCordAdjusted?: number;
  yCordAdjusted?: number;
  arenaAdjustedXCord?: number;
  arenaAdjustedYCord?: number;
  goal?: boolean | number | string;
  shotWasOnGoal?: boolean | number | string;
  event?: string;
  shotType?: string;
  shotDistance?: number;
  arenaAdjustedShotDistance?: number;
  shotAngle?: number;
  shotAngleAdjusted?: number;
  xGoal?: number;
  period?: number;
  time?: number | string;
  team?: string;
  teamCode?: string;
  shooterName?: string;
  homeTeamCode?: string;
  awayTeamCode?: string;
  isHomeTeam?: boolean | number | string;
  homeSkatersOnIce?: number;
  awaySkatersOnIce?: number;
  shotGeneratedRebound?: boolean | number | string;
  shotGoalieFroze?: boolean | number | string;
  shotPlayStopped?: boolean | number | string;
  lastEventCategory?: string;
}

export default function HockeyHeatMapPage() {
  const [csvData, setCsvData] = useState<CSVShotData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseProgress, setParseProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    setParseProgress(0);

    // Check file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setIsLoading(false);
      return;
    }

    // Parse CSV file with chunking for large files
    const allData: CSVShotData[] = [];
    let rowCount = 0;
    let hasValidatedColumns = false;
    
    Papa.parse<CSVShotData>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimitersToGuess: [',', '\t', '|', ';'],
        chunk: (results, parser) => {
        // Process each chunk of data
        if (!results) {
            console.error('Received undefined results in chunk');
            return;
        }
        
        // Validate columns on first chunk
        if (!hasValidatedColumns && results.data && results.data.length > 0) {
            const firstRow = results.data[0];
            const hasCoordinates = 
            ('xCord' in firstRow || 'xCordAdjusted' in firstRow || 'arenaAdjustedXCord' in firstRow) &&
            ('yCord' in firstRow || 'yCordAdjusted' in firstRow || 'arenaAdjustedYCord' in firstRow);
            
            if (!hasCoordinates) {
            parser.abort();
            setError('CSV file does not appear to contain shot coordinate data (xCord/yCord columns)');
            setIsLoading(false);
            return;
            }
            hasValidatedColumns = true;
            console.log('Column validation passed');
        }
        
        // Add data from this chunk
        if (results.data && Array.isArray(results.data)) {
            allData.push(...results.data);
            rowCount += results.data.length;
            
            // Update progress based on rows processed
            const estimatedProgress = Math.min(90, Math.floor((rowCount / 10000) * 90));
            setParseProgress(estimatedProgress);
            
            // Log progress every 1000 rows
            if (rowCount % 1000 === 0) {
            console.log(`Processed ${rowCount} rows...`);
            }
        }
        
        // Handle any errors in this chunk
        if (results.errors && results.errors.length > 0) {
            console.warn('Chunk parse warnings:', results.errors);
        }
        },
        complete: (results) => {
        // Check if we have data
        if (!results) {
            console.log('Complete called with no results, but we have data:', allData.length);
        }
        
        if (allData.length === 0) {
            setError('No valid data found in CSV file');
            setIsLoading(false);
            return;
        }
        
        console.log(`Successfully parsed ${allData.length} shots from ${file.name}`);
        setCsvData(allData);
        setIsLoading(false);
        setParseProgress(100);
        },
        error: (error: any) => {
        console.error('Parse error:', error);
        setError(`Failed to parse CSV: ${error?.message || 'Unknown error'}`);
        setIsLoading(false);
        },
        // Settings for better performance with large files
        worker: false, // Set to true if you want to use web workers (requires additional setup)
        chunkSize: 1024 * 1024 * 3, // 3MB chunks
        fastMode: false, // Keep false to handle quoted fields properly
        beforeFirstChunk: () => {
        setParseProgress(5);
        console.log('Starting to parse CSV file...');
        }
    });
  };

  // Alternative: Load CSV from URL
  const loadCSVFromURL = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      Papa.parse<CSVShotData>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
          setIsLoading(false);
          console.log(`Loaded ${results.data.length} shots from URL`);
        },
        error: (error: any) => {
            console.error('Parse error:', error);
            setError(`Failed to parse CSV: ${error.message || 'Unknown error'}`);
            setIsLoading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CSV from URL');
      setIsLoading(false);
    }
  };

  // Sample data for testing (optional)
  const loadSampleData = () => {
    const sampleData: CSVShotData[] = [
      {
        shotID: '1',
        xCordAdjusted: 70,
        yCordAdjusted: 0,
        goal: 1,
        shotWasOnGoal: 1,
        shotType: 'Wrist Shot',
        shotDistance: 15,
        shotAngle: 0,
        xGoal: 0.25,
        period: 1,
        team: 'DAL',
        shooterName: 'Tyler Seguin'
      },
      {
        shotID: '2',
        xCordAdjusted: 60,
        yCordAdjusted: 10,
        goal: 0,
        shotWasOnGoal: 1,
        shotType: 'Slap Shot',
        shotDistance: 30,
        shotAngle: 15,
        xGoal: 0.08,
        period: 2,
        team: 'DAL',
        shooterName: 'Jamie Benn'
      },
      {
        shotID: '3',
        xCordAdjusted: 75,
        yCordAdjusted: -5,
        goal: 0,
        shotWasOnGoal: 0,
        event: 'BLOCKED_SHOT',
        shotType: 'Wrist Shot',
        shotDistance: 12,
        shotAngle: -8,
        xGoal: 0.15,
        period: 3,
        team: 'DAL',
        shooterName: 'Roope Hintz'
      },
      // Add more sample shots to see heat map effect
      ...Array.from({ length: 50 }, (_, i) => ({
        shotID: `sample-${i + 4}`,
        xCordAdjusted: 50 + Math.random() * 40,
        yCordAdjusted: -20 + Math.random() * 40,
        goal: Math.random() > 0.9 ? 1 : 0,
        shotWasOnGoal: Math.random() > 0.3 ? 1 : 0,
        event: Math.random() > 0.7 ? 'BLOCKED_SHOT' : undefined,
        shotType: ['Wrist Shot', 'Slap Shot', 'Snap Shot', 'Backhand'][Math.floor(Math.random() * 4)],
        shotDistance: 10 + Math.random() * 40,
        shotAngle: -30 + Math.random() * 60,
        xGoal: Math.random() * 0.4,
        period: Math.ceil(Math.random() * 3),
        team: ['DAL', 'MIN', 'COL', 'NSH'][Math.floor(Math.random() * 4)],
        shooterName: `Player ${i + 4}`
      }))
    ];
    
    setCsvData(sampleData);
    setFileName('Sample Data');
  };

  // Clear data
  const clearData = () => {
    setCsvData([]);
    setFileName(null);
    setError(null);
    setParseProgress(0);
    // Reset file input
    const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hockey Shot Heat Map Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a CSV file containing shot data to visualize patterns and analyze performance
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Source
          </h2>
          
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label htmlFor="csv-file-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload CSV File
              </label>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-900 dark:file:text-blue-300
                  dark:hover:file:bg-blue-800"
              />
            </div>

            {/* Or divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
              </div>
            </div>

            {/* Sample Data Button */}
            <div className="flex gap-4">
              <button
                onClick={loadSampleData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Load Sample Data
              </button>
              
              {csvData.length > 0 && (
                <button
                  onClick={clearData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Data
                </button>
              )}
            </div>

            {/* Status Messages */}
            {isLoading && (
              <div className="mt-4">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading CSV file...
                </div>
                {parseProgress > 0 && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${parseProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {fileName && !isLoading && !error && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300">
                  ✓ Loaded <strong>{csvData.length} shots</strong> from <strong>{fileName}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Heat Map Visualization */}
        {csvData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Shot Heat Map Visualization
            </h2>
            <InteractiveHockeyHeatMap 
              csvData={csvData}
              width={900}
              height={450}
            />
          </div>
        )}

        {/* Instructions (shown when no data) */}
        {csvData.length === 0 && !isLoading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
              Getting Started
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-400">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Upload a CSV file containing NHL shot data with columns like xCord, yCord, goal, shotType, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Or click "Load Sample Data" to see the visualization with example data</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Use the filters to explore different shot outcomes, teams, and periods</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Hover over hexagons or individual shots to see detailed statistics</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}