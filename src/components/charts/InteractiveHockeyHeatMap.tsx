'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';
import { ShotData, ShotFilters } from '@/app/api/shots/route';

interface InteractiveHockeyHeatMapProps {
  width?: number;
  height?: number;
  className?: string;
}

interface FilterState extends ShotFilters {
  showHexagons: boolean;
  showIndividualShots: boolean;
  hexagonSize: number;
}

const InteractiveHockeyHeatMap: React.FC<InteractiveHockeyHeatMapProps> = ({
  width = 800,
  height = 400,
  className = "",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [shotData, setShotData] = useState<ShotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    showHexagons: true,
    showIndividualShots: true,
    hexagonSize: 15,
    xGoalMin: 0,
    xGoalMax: 1,
    limit: 5000,
    teams: [], // Start with no teams selected
  });

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: Record<string, unknown> | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  // Available filter options
  const [filterOptions, setFilterOptions] = useState<{
    teams: string[];
    players: string[];
    shotTypes: string[];
  }>({
    teams: [],
    players: [],
    shotTypes: [],
  });

  // Team search functionality
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  // Hockey rink dimensions (scaled to fit SVG)
  const rinkDimensions = useMemo(() => ({
    width: width * 0.9,
    height: height * 0.8,
    centerX: width / 2,
    centerY: height / 2,
  }), [width, height]);

  // Coordinate scaling functions
  const xScale = useMemo(() => 
    d3.scaleLinear()
      .domain([-100, 100]) // Full rink width
      .range([rinkDimensions.centerX - rinkDimensions.width / 2, rinkDimensions.centerX + rinkDimensions.width / 2])
  , [rinkDimensions]);

  const yScale = useMemo(() => 
    d3.scaleLinear()
      .domain([-42.5, 42.5]) // Full rink height
      .range([rinkDimensions.centerY + rinkDimensions.height / 2, rinkDimensions.centerY - rinkDimensions.height / 2])
  , [rinkDimensions]);

  // Fetch available teams on component mount
  const fetchAvailableTeams = useCallback(async () => {
    try {
      const response = await fetch('/api/teams');
      const result = await response.json();
      
      if (response.ok) {
        // Teams are already sorted alphabetically from the API
        setFilterOptions(prev => ({ ...prev, teams: result.teams }));
      } else {
        console.error('Failed to fetch teams:', result.error);
      }
    } catch (err) {
      console.error('Failed to fetch available teams:', err);
    }
  }, []);

  // Fetch shot data (only when teams are selected)
  const fetchShotData = useCallback(async () => {
    // Don't fetch data if no teams are selected
    if (!filters.teams || filters.teams.length === 0) {
      setShotData([]);
      setFilterOptions(prev => ({ ...prev, players: [], shotTypes: [] }));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'showHexagons' && key !== 'showIndividualShots' && key !== 'hexagonSize') {
          if (Array.isArray(value)) {
            if (value.length > 0) params.set(key, value.join(','));
          } else {
            params.set(key, String(value));
          }
        }
      });

      const response = await fetch(`/api/shots?${params}`);
      const result = await response.json();

      if (!response.ok) {
        if (result.error?.includes('supabaseUrl is required') || result.details?.includes('Invalid API key')) {
          throw new Error('Supabase configuration missing. Please set up your .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
        }
        throw new Error(result.error || 'Failed to fetch shot data');
      }

      setShotData(result.data);

      // Extract unique values for filter options from loaded data
      const players = [...new Set(result.data.map((shot: ShotData) => shot.shooter_name))].filter(Boolean) as string[];
      const shotTypes = [...new Set(result.data.map((shot: ShotData) => shot.shot_type))].filter(Boolean) as string[];

      setFilterOptions(prev => ({ ...prev, players, shotTypes }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Filter shot data based on current filters
  const filteredData = useMemo(() => {
    return shotData.filter(shot => {
      if (filters.teams && filters.teams.length > 0 && !filters.teams.includes(shot.team_code)) {
        return false;
      }
      if (filters.periods && filters.periods.length > 0 && !filters.periods.includes(shot.period)) {
        return false;
      }
      if (filters.xGoalMin !== undefined && shot.x_goal < filters.xGoalMin) {
        return false;
      }
      if (filters.xGoalMax !== undefined && shot.x_goal > filters.xGoalMax) {
        return false;
      }
      return true;
    });
  }, [shotData, filters]);

  // Create hexbin layout
  const hexbinGenerator = useMemo(() => {
    return hexbin<ShotData>()
      .x((d: ShotData) => xScale(d.x_cord))
      .y((d: ShotData) => yScale(d.y_cord))
      .radius(filters.hexagonSize)
      .extent([[0, 0], [width, height]]);
  }, [xScale, yScale, width, height, filters.hexagonSize]);

  // Generate hexagon data
  const hexagonData = useMemo(() => {
    if (!filters.showHexagons || filteredData.length === 0) return [];
    
    const bins = hexbinGenerator(filteredData);
    
    return bins.map(bin => ({
      x: bin.x,
      y: bin.y,
      count: bin.length,
      avgXG: bin.reduce((sum, d) => sum + d.x_goal, 0) / bin.length,
      shots: bin,
    }));
  }, [hexbinGenerator, filteredData, filters.showHexagons]);

  // Color scales
  const densityColorScale = useMemo(() => 
    d3.scaleSequential(d3.interpolateOrRd)
      .domain([0, d3.max(hexagonData, d => d.count) || 1])
  , [hexagonData]);

  const xgColorScale = useMemo(() => 
    d3.scaleSequential(d3.interpolateViridis)
      .domain([0, 1])
  , []);

  // Draw hockey rink
  const drawHockeyRink = useCallback((g: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    const rink = g.append('g').attr('class', 'rink');

    // Rink outline
    rink.append('rect')
      .attr('x', rinkDimensions.centerX - rinkDimensions.width / 2)
      .attr('y', rinkDimensions.centerY - rinkDimensions.height / 2)
      .attr('width', rinkDimensions.width)
      .attr('height', rinkDimensions.height)
      .attr('fill', '#f8fafc')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 2)
      .attr('rx', 20);

    // Center line
    rink.append('line')
      .attr('x1', rinkDimensions.centerX)
      .attr('y1', rinkDimensions.centerY - rinkDimensions.height / 2)
      .attr('x2', rinkDimensions.centerX)
      .attr('y2', rinkDimensions.centerY + rinkDimensions.height / 2)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Goal lines
    const goalLineOffset = rinkDimensions.width * 0.15;
    rink.append('line')
      .attr('x1', rinkDimensions.centerX - goalLineOffset)
      .attr('y1', rinkDimensions.centerY - rinkDimensions.height / 2)
      .attr('x2', rinkDimensions.centerX - goalLineOffset)
      .attr('y2', rinkDimensions.centerY + rinkDimensions.height / 2)
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 2);

    rink.append('line')
      .attr('x1', rinkDimensions.centerX + goalLineOffset)
      .attr('y1', rinkDimensions.centerY - rinkDimensions.height / 2)
      .attr('x2', rinkDimensions.centerX + goalLineOffset)
      .attr('y2', rinkDimensions.centerY + rinkDimensions.height / 2)
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 2);

    // Face-off circles
    const faceoffRadius = 15;
    const faceoffPositions = [
      { x: rinkDimensions.centerX, y: rinkDimensions.centerY },
      { x: rinkDimensions.centerX - goalLineOffset * 0.7, y: rinkDimensions.centerY - rinkDimensions.height * 0.25 },
      { x: rinkDimensions.centerX - goalLineOffset * 0.7, y: rinkDimensions.centerY + rinkDimensions.height * 0.25 },
      { x: rinkDimensions.centerX + goalLineOffset * 0.7, y: rinkDimensions.centerY - rinkDimensions.height * 0.25 },
      { x: rinkDimensions.centerX + goalLineOffset * 0.7, y: rinkDimensions.centerY + rinkDimensions.height * 0.25 },
    ];

    faceoffPositions.forEach(pos => {
      rink.append('circle')
        .attr('cx', pos.x)
        .attr('cy', pos.y)
        .attr('r', faceoffRadius)
        .attr('fill', 'none')
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1);
    });

    // Goals
    const goalWidth = 6;
    const goalHeight = 4;
    rink.append('rect')
      .attr('x', rinkDimensions.centerX - goalLineOffset - goalHeight / 2)
      .attr('y', rinkDimensions.centerY - goalWidth / 2)
      .attr('width', goalHeight)
      .attr('height', goalWidth)
      .attr('fill', '#dbeafe')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    rink.append('rect')
      .attr('x', rinkDimensions.centerX + goalLineOffset - goalHeight / 2)
      .attr('y', rinkDimensions.centerY - goalWidth / 2)
      .attr('width', goalHeight)
      .attr('height', goalWidth)
      .attr('fill', '#dbeafe')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);
  }, [rinkDimensions]);

  // Render the visualization
  useEffect(() => {
    if (!svgRef.current || loading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group
    const g = svg.append('g');

    // Draw rink
    drawHockeyRink(g);

    // Draw hexagons
    if (filters.showHexagons && hexagonData.length > 0) {
      const hexagons = g.selectAll('.hexagon')
        .data(hexagonData)
        .enter()
        .append('path')
        .attr('class', 'hexagon')
        .attr('d', hexbinGenerator.hexagon())
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .style('fill', d => densityColorScale(d.count))
        .style('stroke', '#fff')
        .style('stroke-width', 0.5)
        .style('opacity', 0.7)
        .style('cursor', 'pointer');

      // Hexagon tooltips and interactions
      hexagons
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget).style('opacity', 1);
          setTooltip({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            data: {
              type: 'hexagon',
              count: d.count,
              avgXG: d.avgXG.toFixed(3),
              shots: d.shots,
            },
          });
        })
        .on('mousemove', (event) => {
          setTooltip(prev => ({
            ...prev,
            x: event.pageX,
            y: event.pageY,
          }));
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget).style('opacity', 0.7);
          setTooltip(prev => ({ ...prev, visible: false }));
        });
    }

    // Draw individual high-value shots
    if (filters.showIndividualShots) {
      const highValueShots = filteredData.filter(d => d.x_goal > 0.15);

      g.selectAll('.shot-dot')
        .data(highValueShots)
        .enter()
        .append('circle')
        .attr('class', 'shot-dot')
        .attr('cx', d => xScale(d.x_cord))
        .attr('cy', d => yScale(d.y_cord))
        .attr('r', d => 2 + d.x_goal * 4)
        .style('fill', d => xgColorScale(d.x_goal))
        .style('stroke', '#333')
        .style('stroke-width', 0.5)
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget).attr('r', (2 + d.x_goal * 4) * 1.5);
          setTooltip({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            data: {
              type: 'shot',
              ...d,
            },
          });
        })
        .on('mouseout', (event, d) => {
          d3.select(event.currentTarget).attr('r', 2 + d.x_goal * 4);
          setTooltip(prev => ({ ...prev, visible: false }));
        });
    }

  }, [filteredData, hexagonData, filters, xScale, yScale, hexbinGenerator, densityColorScale, xgColorScale, loading, drawHockeyRink]);

  // Fetch available teams on mount
  useEffect(() => {
    fetchAvailableTeams();
  }, [fetchAvailableTeams]);

  // Fetch data when filters change (only if teams are selected)
  useEffect(() => {
    fetchShotData();
  }, [fetchShotData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTeamDropdown && !event.target) {
        setShowTeamDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTeamDropdown]);

  // Update filter function
  const updateFilter = (key: keyof FilterState, value: string | number | boolean | string[] | number[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Filter teams based on search term
  const filteredTeams = filterOptions.teams.filter(team => 
    team.toLowerCase().includes(teamSearchTerm.toLowerCase())
  );

  // Handle team selection
  const handleTeamSelect = (team: string) => {
    const currentTeams = filters.teams || [];
    const newTeams = currentTeams.includes(team)
      ? currentTeams.filter(t => t !== team)
      : [...currentTeams, team];
    
    updateFilter('teams', newTeams);
    // Close the dropdown after selection
    setShowTeamDropdown(false);
    setTeamSearchTerm(''); // Also clear the search term
  };

  // Handle team removal
  const handleTeamRemove = (team: string) => {
    const currentTeams = filters.teams || [];
    updateFilter('teams', currentTeams.filter(t => t !== team));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading shot data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          <button 
            onClick={() => fetchShotData()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Controls Panel */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Interactive Shot Map ({filteredData.length.toLocaleString()} shots)
          </h3>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Team Filter - Searchable Multi-Select */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teams *
            </label>
            
            {/* Selected Teams Display */}
            {filters.teams && filters.teams.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {filters.teams.map(team => (
                  <span
                    key={team}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {team}
                    <button
                      type="button"
                      onClick={() => handleTeamRemove(team)}
                      className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-500 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={filters.teams?.length ? "Add more teams..." : "Search and select teams..."}
                value={teamSearchTerm}
                onChange={(e) => setTeamSearchTerm(e.target.value)}
                onFocus={() => setShowTeamDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Dropdown */}
              {showTeamDropdown && filteredTeams.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredTeams.slice(0, 10).map(team => {
                    const isSelected = filters.teams?.includes(team) || false;
                    return (
                      <button
                        key={team}
                        type="button"
                        onClick={() => handleTeamSelect(team)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:bg-gray-50 dark:focus:bg-gray-600 focus:outline-none ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{team}</span>
                          {isSelected && (
                            <span className="text-blue-600 dark:text-blue-400">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* No teams selected message */}
            {(!filters.teams || filters.teams.length === 0) && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Please select at least one team to view shot data
              </p>
            )}
          </div>

          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Periods
            </label>
            <div className="space-y-2">
              {[1, 2, 3].map(period => (
                <label key={period} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.periods?.includes(period) || false}
                    onChange={(e) => {
                      const periods = filters.periods || [];
                      if (e.target.checked) {
                        updateFilter('periods', [...periods, period]);
                      } else {
                        updateFilter('periods', periods.filter(p => p !== period));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Period {period}</span>
                </label>
              ))}
            </div>
          </div>

          {/* xG Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Goals Range
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={filters.xGoalMin || 0}
                onChange={(e) => updateFilter('xGoalMin', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Min: {(filters.xGoalMin || 0).toFixed(2)}
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={filters.xGoalMax || 1}
                onChange={(e) => updateFilter('xGoalMax', Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Max: {(filters.xGoalMax || 1).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showHexagons}
                  onChange={(e) => updateFilter('showHexagons', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Heat Map</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showIndividualShots}
                  onChange={(e) => updateFilter('showIndividualShots', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">High-Value Shots</span>
              </label>
              <div className="mt-2">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Heat Map Size: {filters.hexagonSize}
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={filters.hexagonSize}
                  onChange={(e) => updateFilter('hexagonSize', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('xGoalMin', 0.8)}
            className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
          >
            High Quality Only (xG &gt; 0.8)
          </button>
          <button
            onClick={() => updateFilter('xGoalMin', 0.15)}
            className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            High Danger Area (xG &gt; 0.15)
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, teams: [], periods: [], xGoalMin: 0, xGoalMax: 1 }))}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Shot Map */}
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 dark:border-gray-600 rounded-lg bg-white"
        />

        {/* Tooltip */}
        {tooltip.visible && tooltip.data && (
          <div
            className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-10 pointer-events-none"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
            }}
          >
            {tooltip.data.type === 'hexagon' ? (
              <div>
                <div className="font-semibold">Heat Map Cell</div>
                <div>Shots: {String(tooltip.data.count || 0)}</div>
                <div>Avg xG: {String(tooltip.data.avgXG || '0.000')}</div>
              </div>
            ) : (
              <div>
                <div className="font-semibold">{String(tooltip.data.shooter_name || '')}</div>
                <div>{String(tooltip.data.team_code || '')} - Period {String(tooltip.data.period || '')}</div>
                <div>xG: {typeof tooltip.data.x_goal === 'number' ? tooltip.data.x_goal.toFixed(3) : '0.000'}</div>
                <div>Distance: {typeof tooltip.data.shot_distance === 'number' ? tooltip.data.shot_distance.toFixed(1) : '0'}ft</div>
                <div>Type: {String(tooltip.data.shot_type || '')}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            High Density
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
            High xG Shot
          </div>
        </div>
        <div className="text-xs">
          Total Expected Goals: {filteredData.reduce((sum, shot) => sum + shot.x_goal, 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default InteractiveHockeyHeatMap;
