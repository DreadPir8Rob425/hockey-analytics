import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';

// Define the structure of CSV shot data
interface CSVShotData {
  // Existing fields
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
  
  // Add these new fields from your CSV
  shotOnEmptyNet?: boolean | number | string;
  homeEmptyNet?: boolean | number | string;
  awayEmptyNet?: boolean | number | string;
  shotRebound?: boolean | number | string;
  shotRush?: boolean | number | string;
}

interface ProcessedShot {
  x: number;
  y: number;
  xGoal: number;
  isGoal: boolean;
  isOnGoal: boolean;
  isBlocked: boolean;
  isMissed: boolean;
  shotType: string;
  shotDistance: number;
  shotAngle: number;
  period: number;
  team: string;
  shooter: string;
  outcome: 'goal' | 'save' | 'block' | 'miss';
  
  // Add these new fields
  isEmptyNet: boolean;
  isRebound: boolean;
  isPowerPlay: boolean;
  isPenaltyKill: boolean;
  isEvenStrength: boolean;
  isShootout: boolean;
}

interface HexbinData {
  x: number;
  y: number;
  count: number;
  avgXG: number;
  goals: number;
  shots: ProcessedShot[];
}

interface InteractiveHockeyHeatMapProps {
  csvData: CSVShotData[];
  width?: number;
  height?: number;
}

const InteractiveHockeyHeatMap: React.FC<InteractiveHockeyHeatMapProps> = ({
  csvData,
  width = 900,
  height = 450,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    // Existing filters
    teams: [] as string[],
    periods: [] as number[],
    outcomes: ['goal', 'save', 'block', 'miss'] as string[],
    shotTypes: [] as string[],
    xGoalMin: 0,
    xGoalMax: 1,
    showHexagons: true,
    showIndividualShots: false,
    hexagonSize: 15,
    
    // New filters
    emptyNet: false,
    reboundGoals: false,
    powerPlay: false,
    penaltyKill: false,
    evenStrength: false,
    shootout: false,
    xCoordMin: 0,
    xCoordMax: 100,
  });

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: any;
  }>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  // Get unique filter options from data
  const filterOptions = useMemo(() => {
    if (!csvData || csvData.length === 0) return { teams: [], shotTypes: [], periods: [] };
    
    const teams = [...new Set(csvData.map(s => s.team || s.teamCode).filter(Boolean))].sort() as string[];
    const shotTypes = [...new Set(csvData.map(s => s.shotType).filter(Boolean))].sort() as string[];
    const periods = [...new Set(csvData.map(s => s.period).filter(Boolean))].sort() as number[];
    
    return { teams, shotTypes, periods };
  }, [csvData]);

  // Transform CSV data
  const processedData = useMemo((): ProcessedShot[] => {
    return csvData.map(shot => {
      // Use adjusted coordinates if available
      const x = shot.xCordAdjusted ?? shot.arenaAdjustedXCord ?? shot.xCord ?? 0;
      const y = shot.yCordAdjusted ?? shot.arenaAdjustedYCord ?? shot.yCord ?? 0;
      
      // Determine game situations
      const homeSk = shot.homeSkatersOnIce ?? 5;
      const awaySk = shot.awaySkatersOnIce ?? 5;
      const isHome = shot.isHomeTeam === 1 || shot.isHomeTeam === true;
      
      // Determine shot outcome
      const isGoal = shot.goal === 1 || shot.goal === true || shot.goal === 'true' || shot.goal === '1';
      const isOnGoal = shot.shotWasOnGoal === 1 || shot.shotWasOnGoal === true || shot.shotWasOnGoal === 'true' || shot.shotWasOnGoal === '1';
      const isBlocked = shot.event === 'BLOCKED_SHOT' || shot.lastEventCategory === 'BLOCKED_SHOT';
      const isMissed = !isGoal && !isOnGoal && !isBlocked;
      
      const isEmptyNet = shot.shotOnEmptyNet === 1 || 
                       shot.homeEmptyNet === 1 || 
                       shot.awayEmptyNet === 1;
      const isRebound = shot.shotRebound === 1 || shot.shotRebound === true;
      const isPowerPlay = (isHome && homeSk > awaySk) || (!isHome && awaySk > homeSk);
      const isPenaltyKill = (isHome && homeSk < awaySk) || (!isHome && awaySk < homeSk);
      const isEvenStrength = homeSk === awaySk && homeSk === 5;
      const isShootout = shot.period > 4 || (shot.period === 4 && homeSk === 1 && awaySk === 1);
      
      let outcome: 'goal' | 'save' | 'block' | 'miss';
      if (isGoal) outcome = 'goal';
      else if (isBlocked) outcome = 'block';
      else if (isOnGoal) outcome = 'save';
      else outcome = 'miss';
      
      return {
        x: Math.abs(x), // Use absolute value for offensive zone
        y,
        xGoal: shot.xGoal ?? 0,
        isGoal,
        isOnGoal,
        isBlocked,
        isMissed,
        shotType: shot.shotType || 'Unknown',
        shotDistance: shot.arenaAdjustedShotDistance ?? shot.shotDistance ?? 0,
        shotAngle: shot.shotAngleAdjusted ?? shot.shotAngle ?? 0,
        period: shot.period ?? 0,
        team: shot.team || shot.teamCode || 'Unknown',
        shooter: shot.shooterName || 'Unknown',
        isEmptyNet,
        isRebound,
        isPowerPlay,
        isPenaltyKill,
        isEvenStrength,
        isShootout,
        outcome,
      };
    }).filter(shot => shot.x !== 0 || shot.y !== 0);
  }, [csvData]);

  // Apply filters to get filtered data
  const filteredData = useMemo(() => {
    return processedData.filter(shot => {
      // Existing filters
      if (filters.teams.length > 0 && !filters.teams.includes(shot.team)) return false;
      if (filters.periods.length > 0 && !filters.periods.includes(shot.period)) return false;
      if (filters.outcomes.length > 0 && !filters.outcomes.includes(shot.outcome)) return false;
      if (filters.shotTypes.length > 0 && !filters.shotTypes.includes(shot.shotType)) return false;
      if (shot.xGoal < filters.xGoalMin || shot.xGoal > filters.xGoalMax) return false;
      
      // New situation filters (only apply if checked)
      if (filters.emptyNet && !shot.isEmptyNet) return false;
      if (filters.reboundGoals && !(shot.isGoal && shot.isRebound)) return false;
      if (filters.powerPlay && !shot.isPowerPlay) return false;
      if (filters.penaltyKill && !shot.isPenaltyKill) return false;
      if (filters.evenStrength && !shot.isEvenStrength) return false;
      if (filters.shootout && !shot.isShootout) return false;
      
      // X-coordinate filter
      if (shot.x < filters.xCoordMin || shot.x > filters.xCoordMax) return false;
      
      return true;
    });
  }, [processedData, filters]);

  // Calculate statistics from filtered data
  const stats = useMemo(() => {
    const total = filteredData.length;
    const goals = filteredData.filter(s => s.isGoal).length;
    const saves = filteredData.filter(s => s.isOnGoal && !s.isGoal).length;
    const blocks = filteredData.filter(s => s.isBlocked).length;
    const misses = filteredData.filter(s => s.isMissed).length;
    const avgXG = total > 0 ? filteredData.reduce((sum, s) => sum + s.xGoal, 0) / total : 0;
    const shootingPct = total > 0 ? (goals / total) * 100 : 0;
    
    return { total, goals, saves, blocks, misses, avgXG, shootingPct };
  }, [filteredData]);

  // Setup scales
  const xScale = useMemo(() => 
    d3.scaleLinear().domain([0, 100]).range([0, width * 0.9])
  , [width]);
  
  const yScale = useMemo(() => 
    d3.scaleLinear().domain([-42.5, 42.5]).range([0, height * 0.9])
  , [height]);

  // Create hexbin generator
  const hexbinGenerator = useMemo(() => {
    return hexbin<ProcessedShot>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .radius(filters.hexagonSize)
      .extent([[0, 0], [width, height]]);
  }, [xScale, yScale, width, height, filters.hexagonSize]);

  // Generate hexagon data
  const hexagonData = useMemo((): HexbinData[] => {
    if (!filters.showHexagons || filteredData.length === 0) return [];
    
    const bins = hexbinGenerator(filteredData);
    
    return bins.map(bin => ({
      x: bin.x,
      y: bin.y,
      count: bin.length,
      avgXG: bin.length > 0 ? bin.reduce((sum, d) => sum + d.xGoal, 0) / bin.length : 0,
      goals: bin.filter(d => d.isGoal).length,
      shots: bin,
    }));
  }, [hexbinGenerator, filteredData, filters.showHexagons]);

  // Color scale for heat map - using blues for better visibility
  const colorScale = useMemo(() => {
    const maxCount = d3.max(hexagonData, d => d.count) || 1;
    // Custom color interpolation for better low-value visibility
    return d3.scaleSequential()
      .domain([0, maxCount])
      .interpolator(d3.interpolateRgb("#e3f2fd", "#0d47a1")); // Light blue to dark blue
    // Alternative options:
    // .interpolator(d3.interpolateBlues) // Standard blues
    // .interpolator(d3.interpolateYlOrRd) // Yellow-Orange-Red
    // .interpolator(d3.interpolatePlasma) // Purple-Pink-Yellow
  }, [hexagonData]);

  // Draw the visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const rinkWidth = width - margin.left - margin.right;
    const rinkHeight = height - margin.top - margin.bottom;

    // Draw rink background
    const rink = g.append('g').attr('class', 'rink');

    // Ice surface
    rink.append('rect')
      .attr('width', rinkWidth)
      .attr('height', rinkHeight)
      .attr('fill', '#f0f4f8')
      .attr('stroke', '#cbd5e0')
      .attr('stroke-width', 2)
      .attr('rx', 28);

    // Center ice red line (at rink center - left edge of view)
    rink.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', rinkHeight)
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 4);

    const blueLineX = xScale(25);  // Blue line at x=25
    rink.append('line')
      .attr('x1', blueLineX)
      .attr('y1', 0)
      .attr('x2', blueLineX)
      .attr('y2', rinkHeight)
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 4);

    const goalLineX = xScale(89);  // Goal at x=89
    rink.append('line')
      .attr('x1', goalLineX)
      .attr('y1', 0)
      .attr('x2', goalLineX)
      .attr('y2', rinkHeight)
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3);

    // Goal itself (behind the goal line, in the net)
    const goalDepth = 4; // 4 feet deep
    const goalPostDistance = yScale(0) - yScale(3); // 3 feet on each side
    const goalCenterY = rinkHeight / 2;

    // Goal net (behind goal line)
    rink.append('path')
      .attr('d', `
        M ${goalLineX} ${goalCenterY - goalPostDistance}
        L ${goalLineX + goalDepth * 2} ${goalCenterY - goalPostDistance}
        L ${goalLineX + goalDepth * 2} ${goalCenterY + goalPostDistance}
        L ${goalLineX} ${goalCenterY + goalPostDistance}
      `)
      .attr('fill', 'rgba(100, 100, 100, 0.2)')
      .attr('stroke', '#666')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,1');

    // Goal posts and crossbar
    rink.append('rect')
      .attr('x', goalLineX - 1)
      .attr('y', goalCenterY - goalPostDistance)
      .attr('width', 2)
      .attr('height', goalPostDistance * 2)
      .attr('fill', '#dc2626');

    // Goal post circles (the actual posts)
    [goalCenterY - goalPostDistance, goalCenterY + goalPostDistance].forEach(y => {
      rink.append('circle')
        .attr('cx', goalLineX)
        .attr('cy', y)
        .attr('r', 2.5)
        .attr('fill', '#dc2626')
        .attr('stroke', '#000')
        .attr('stroke-width', 0.5);
    });

    
    // Goal crease - proper semicircle extending left from goal line
    const creaseRadius = Math.abs(yScale(6) - yScale(0)); // 6 feet in data coordinates

    // Draw crease as semicircle extending left
    rink.append('path')
      .attr('d', `
        M ${goalLineX} ${goalCenterY - creaseRadius}
        A ${creaseRadius} ${creaseRadius} 0 1 0 ${goalLineX} ${goalCenterY + creaseRadius}
        Z
      `)
      .attr('fill', 'rgba(219, 234, 254, 0.5)')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);
    


    // Faceoff circles at x=69, y=±22
    const faceoffCircles = [
      { x: xScale(69), y: yScale(22) },
      { x: xScale(69), y: yScale(-22) },
    ];

    // Draw faceoff circles
    faceoffCircles.forEach(pos => {
      // Outer circle
      rink.append('circle')
        .attr('cx', pos.x)
        .attr('cy', pos.y)
        .attr('r', 30)
        .attr('fill', 'none')
        .attr('stroke', '#dc2626')
        .attr('stroke-width', 2);
      
      // Inner dot - INCREASED SIZE 4X
      rink.append('circle')
        .attr('cx', pos.x)
        .attr('cy', pos.y)
        .attr('r', 4)  // Changed from 1 to 4
        .attr('fill', '#dc2626');
      
      // Hash marks
      const hashLength = 4;
      const hashOffset = 35;
      
      // Top and bottom hash marks
      [-1, 1].forEach(dir => {
        rink.append('line')
          .attr('x1', pos.x - hashLength)
          .attr('x2', pos.x + hashLength)
          .attr('y1', pos.y + (hashOffset * dir))
          .attr('y2', pos.y + (hashOffset * dir))
          .attr('stroke', '#dc2626')
          .attr('stroke-width', 2);
      });
      
      // Left and right hash marks  
      [-1, 1].forEach(dir => {
        rink.append('line')
          .attr('x1', pos.x + (hashOffset * dir))
          .attr('x2', pos.x + (hashOffset * dir))
          .attr('y1', pos.y - hashLength)
          .attr('y2', pos.y + hashLength)
          .attr('stroke', '#dc2626')
          .attr('stroke-width', 2);
      });
    });

    // Neutral zone dots at x=20, y=±22
    const neutralDots = [
      { x: xScale(20), y: yScale(22) },
      { x: xScale(20), y: yScale(-22) },
    ];

    neutralDots.forEach(pos => {
      rink.append('circle')
        .attr('cx', pos.x)
        .attr('cy', pos.y)
        .attr('r', 4)  // INCREASED SIZE 4X
        .attr('fill', '#dc2626');
    });

    {/* Game Situation Filters */}
    <div className="border-t pt-4 mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Game Situations
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.emptyNet}
            onChange={(e) => setFilters(prev => ({ ...prev, emptyNet: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Empty Net</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.reboundGoals}
            onChange={(e) => setFilters(prev => ({ ...prev, reboundGoals: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Rebound Goals</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.powerPlay}
            onChange={(e) => setFilters(prev => ({ ...prev, powerPlay: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Power Play</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.penaltyKill}
            onChange={(e) => setFilters(prev => ({ ...prev, penaltyKill: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Penalty Kill</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.evenStrength}
            onChange={(e) => setFilters(prev => ({ ...prev, evenStrength: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Even Strength</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.shootout}
            onChange={(e) => setFilters(prev => ({ ...prev, shootout: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Shootout</span>
        </label>
      </div>
    </div>

    {/* Shot Location Filter */}
    <div className="border-t pt-4 mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Shot Location Zone
      </label>
      <div className="flex gap-2 flex-wrap mb-2">
        <button
          onClick={() => setFilters(prev => ({ ...prev, xCoordMin: 0, xCoordMax: 100 }))}
          className={`px-3 py-1 text-xs rounded ${
            filters.xCoordMin === 0 && filters.xCoordMax === 100
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All Zones
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, xCoordMin: 0, xCoordMax: 25 }))}
          className={`px-3 py-1 text-xs rounded ${
            filters.xCoordMin === 0 && filters.xCoordMax === 25
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Beyond Blue Line
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, xCoordMin: 25, xCoordMax: 69 }))}
          className={`px-3 py-1 text-xs rounded ${
            filters.xCoordMin === 25 && filters.xCoordMax === 69
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          High Slot
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, xCoordMin: 69, xCoordMax: 89 }))}
          className={`px-3 py-1 text-xs rounded ${
            filters.xCoordMin === 69 && filters.xCoordMax === 89
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Low Slot
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, xCoordMin: 89, xCoordMax: 100 }))}
          className={`px-3 py-1 text-xs rounded ${
            filters.xCoordMin === 89 && filters.xCoordMax === 100
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Crease Area
        </button>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Current range: x={filters.xCoordMin} to x={filters.xCoordMax}
      </div>
    </div>


    // Add coordinate reference system for debugging
    const debugMode = false; // Set to false to hide these helpers

    if (debugMode) {
      // Add X-axis coordinate labels
      const xCoordLabels = [0, 25, 50, 75, 100];
      xCoordLabels.forEach(coord => {
        const xPos = xScale(coord);
        
        // Vertical reference line
        rink.append('line')
          .attr('x1', xPos)
          .attr('y1', 0)
          .attr('x2', xPos)
          .attr('y2', rinkHeight)
          .attr('stroke', '#10b981')
          .attr('stroke-width', 0.5)
          .attr('stroke-dasharray', '2,2')
          .attr('opacity', 0.3);
        
        // Coordinate label
        rink.append('text')
          .attr('x', xPos)
          .attr('y', -5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#10b981')
          .text(`x=${coord}`);
      });
      
      // Add Y-axis coordinate labels
      const yCoordLabels = [-40, -20, 0, 20, 40];
      yCoordLabels.forEach(coord => {
        const yPos = yScale(coord);
        
        // Horizontal reference line
        rink.append('line')
          .attr('x1', 0)
          .attr('y1', yPos)
          .attr('x2', rinkWidth)
          .attr('y2', yPos)
          .attr('stroke', '#10b981')
          .attr('stroke-width', 0.5)
          .attr('stroke-dasharray', '2,2')
          .attr('opacity', 0.3);
        
        // Coordinate label
        rink.append('text')
          .attr('x', -25)
          .attr('y', yPos + 3)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#10b981')
          .text(`y=${coord}`);
      });
      
      // Show actual positions of key rink features
      const rinkInfo = g.append('g').attr('class', 'rink-info');
      
      // Info box
      rinkInfo.append('rect')
        .attr('x', 10)
        .attr('y', rinkHeight - 80)
        .attr('width', 200)
        .attr('height', 70)
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .attr('stroke', '#666')
        .attr('stroke-width', 1);
      
      const infoText = [
        `Red line: x=0`,
        `Neutral dots: x=${(0.20 * 100).toFixed(0)}`,
        `Blue line: x=${(0.40 * 100).toFixed(0)}`,
        `Off. zone circles: x=${(0.69 * 100).toFixed(0)}`,
        `Goal line: x=${(0.89 * 100).toFixed(0)}`
      ];
      
      infoText.forEach((text, i) => {
        rinkInfo.append('text')
          .attr('x', 15)
          .attr('y', rinkHeight - 60 + (i * 12))
          .attr('font-size', '10px')
          .attr('fill', '#333')
          .text(text);
      });
    }

    // Draw hexagons
    if (filters.showHexagons && hexagonData.length > 0) {
      const hexagons = g.selectAll('.hexagon')
        .data(hexagonData)
        .enter()
        .append('path')
        .attr('class', 'hexagon')
        .attr('d', hexbinGenerator.hexagon())
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .style('fill', d => colorScale(d.count))
        .style('stroke', '#334155') // Darker stroke for better contrast
        .style('stroke-width', 0.5)
        .style('opacity', 0.85) // Slightly higher opacity
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .style('opacity', 1)
            .style('stroke-width', 2);
          
          setTooltip({
            visible: true,
            x: event.pageX + 10,
            y: event.pageY - 10,
            data: {
              type: 'hexagon',
              count: d.count,
              avgXG: d.avgXG,
              goals: d.goals,
            }
          });
        })
        .on('mousemove', function(event) {
          setTooltip(prev => ({
            ...prev,
            x: event.pageX + 10,
            y: event.pageY - 10,
          }));
        })
        .on('mouseout', function() {
          d3.select(this)
            .style('opacity', 0.8)
            .style('stroke-width', 0.5);
          
          setTooltip(prev => ({ ...prev, visible: false }));
        });
    }

    // Draw individual high-value shots
    if (filters.showIndividualShots) {
      const highValueShots = filteredData.filter(s => s.xGoal > 0.15);
      
      const shotMarkers = g.selectAll('.shot-marker')
        .data(highValueShots)
        .enter()
        .append('circle')
        .attr('class', 'shot-marker')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => 2 + (d.xGoal * 8))
        .attr('fill', d => {
          if (d.isGoal) return '#10b981';
          if (d.isBlocked) return '#f59e0b';
          if (d.isOnGoal) return '#3b82f6';
          return '#ef4444';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('opacity', 1)
            .attr('r', 2 + (d.xGoal * 12));
          
          setTooltip({
            visible: true,
            x: event.pageX + 10,
            y: event.pageY - 10,
            data: {
              type: 'shot',
              outcome: d.outcome,
              shooter: d.shooter,
              team: d.team,
              shotType: d.shotType,
              shotDistance: d.shotDistance,
              shotAngle: d.shotAngle,
              xGoal: d.xGoal,
              period: d.period,
            }
          });
        })
        .on('mousemove', function(event) {
          setTooltip(prev => ({
            ...prev,
            x: event.pageX + 10,
            y: event.pageY - 10,
          }));
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('opacity', 0.7)
            .attr('r', 2 + (d.xGoal * 8));
          
          setTooltip(prev => ({ ...prev, visible: false }));
        });
    }

  }, [filteredData, hexagonData, filters.showHexagons, filters.showIndividualShots, 
      width, height, xScale, yScale, hexbinGenerator, colorScale]);

  // Toggle filter helper
  const toggleArrayFilter = (filterKey: string, value: any) => {
  setFilters(prev => {
    if (filterKey in prev && Array.isArray(prev[filterKey as keyof typeof prev])) {
      const currentArray = prev[filterKey as keyof typeof prev] as any[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [filterKey]: newArray };
    }
    return prev;
  });
};

  return (
    <div className="w-full space-y-4">
      {/* Filter Controls */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
        {/* Shot Outcome Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shot Outcomes
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'goal', label: 'Goals', color: 'bg-green-500' },
              { value: 'save', label: 'Saves', color: 'bg-blue-500' },
              { value: 'block', label: 'Blocks', color: 'bg-orange-500' },
              { value: 'miss', label: 'Misses', color: 'bg-red-500' },
            ].map(outcome => (
              <button
                key={outcome.value}
                onClick={() => toggleArrayFilter('outcomes', outcome.value)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 transition-all ${
                  filters.outcomes.includes(outcome.value)
                    ? 'bg-gray-800 text-white border-2 border-gray-600'
                    : 'bg-gray-400 text-gray-200 border-2 border-gray-500'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${outcome.color}`}></span>
                {outcome.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teams
            </label>
            <select
              multiple
              value={filters.teams}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFilters(prev => ({ ...prev, teams: selected }));
              }}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              size={3}
            >
              {filterOptions.teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Periods
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(period => (
                <button
                  key={period}
                  onClick={() => toggleArrayFilter('periods', period)}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.periods.includes(period)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {period === 4 ? 'OT' : period}
                </button>
              ))}
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
                  onChange={(e) => setFilters(prev => ({ ...prev, showHexagons: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show Heat Map Overlay</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showIndividualShots}
                  onChange={(e) => setFilters(prev => ({ ...prev, showIndividualShots: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Show High-Value Shots (xG &gt; 0.15)</span>
              </label>
            </div>
          </div>
        </div>

        {/* xGoal Range Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expected Goals (xG) Filter: {filters.xGoalMin.toFixed(2)} - {filters.xGoalMax.toFixed(2)}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Filter shots by their scoring probability (0.00 = 0% chance, 1.00 = 100% chance)
            </p>
            
            <div className="space-y-3">
              {/* Side by side sliders */}
              <div className="grid grid-cols-2 gap-4">
                {/* Min slider */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Minimum xG: {filters.xGoalMin.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={filters.xGoalMin}
                    onChange={(e) => {
                      const newMin = parseFloat(e.target.value);
                      setFilters(prev => ({
                        ...prev,
                        xGoalMin: newMin,
                        // Automatically adjust max if it's less than new min
                        xGoalMax: Math.max(newMin, prev.xGoalMax)
                      }));
                    }}
                    className="w-full"
                  />
                </div>
                
                {/* Max slider */}
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Maximum xG: {filters.xGoalMax.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={filters.xGoalMax}
                    onChange={(e) => {
                      const newMax = parseFloat(e.target.value);
                      setFilters(prev => ({
                        ...prev,
                        xGoalMax: newMax,
                        // Automatically adjust min if it's greater than new max
                        xGoalMin: Math.min(newMax, prev.xGoalMin)
                      }));
                    }}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Visual range indicator */}
              <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded">
                <div 
                  className="absolute h-2 bg-blue-500 rounded"
                  style={{
                    left: `${filters.xGoalMin * 100}%`,
                    width: `${(filters.xGoalMax - filters.xGoalMin) * 100}%`
                  }}
                ></div>
              </div>
              
              {/* Quick presets */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, xGoalMin: 0, xGoalMax: 1 }))}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  All Shots
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, xGoalMin: 0.15, xGoalMax: 1 }))}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  High Danger (&gt;0.15)
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, xGoalMin: 0.05, xGoalMax: 0.15 }))}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Medium (0.05-0.15)
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, xGoalMin: 0, xGoalMax: 0.05 }))}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Low (&lt;0.05)
                </button>
              </div>
            </div>
          </div>

        {/* Hexagon Size (when heat map is enabled) */}
        {filters.showHexagons && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heat Map Granularity: {filters.hexagonSize}px
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Fine</span>
              <input
                type="range"
                min="5"
                max="30"
                value={filters.hexagonSize}
                onChange={(e) => setFilters(prev => ({ ...prev, hexagonSize: parseInt(e.target.value) }))}
                className="w-full"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">Coarse</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Smaller values show more detail, larger values show broader patterns
            </p>
          </div>
        )}
      </div>

      {/* Statistics Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Shots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.goals}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.saves}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Saves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.blocks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Blocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.misses}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Misses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shootingPct.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shooting %</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgXG.toFixed(3)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg xG</div>
            </div>
          </div>
        </div>

      {/* SVG Visualization */}
      <div className="bg-white rounded-lg shadow-lg p-2">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full"
          style={{ maxWidth: width }}
        />
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="fixed bg-gray-900 text-white rounded-lg shadow-xl p-3 z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.data.type === 'hexagon' ? (
            <div>
              <div className="font-bold mb-1">Zone Statistics</div>
              <div className="text-sm space-y-1">
                <div>Shots: {tooltip.data.count}</div>
                <div>Goals: {tooltip.data.goals}</div>
                <div>Avg xG: {tooltip.data.avgXG.toFixed(3)}</div>
                <div>Shooting %: {((tooltip.data.goals / tooltip.data.count) * 100).toFixed(1)}%</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-bold mb-1 capitalize">{tooltip.data.outcome}</div>
              <div className="text-sm space-y-1">
                <div>Shooter: {tooltip.data.shooter}</div>
                <div>Team: {tooltip.data.team}</div>
                <div>Type: {tooltip.data.shotType}</div>
                <div>Distance: {tooltip.data.shotDistance.toFixed(1)} ft</div>
                <div>Angle: {Math.abs(tooltip.data.shotAngle).toFixed(1)}°</div>
                <div>xG: {tooltip.data.xGoal.toFixed(3)}</div>
                <div>Period: {tooltip.data.period}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Heat Map Legend */}
          {filters.showHexagons && hexagonData.length > 0 && (
            <div className="col-span-2">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shot Density Heat Map
              </div>
              <div className="space-y-2">
                {/* Color gradient bar with values */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-8">0</span>
                    <div className="flex h-4 flex-1 relative">
                      {/* Gradient bar */}
                      <div 
                        className="w-full h-full rounded border border-gray-300"
                        style={{
                          background: 'linear-gradient(to right, #e3f2fd 0%, #90caf9 25%, #42a5f5 50%, #1976d2 75%, #0d47a1 100%)'
                        }}
                      ></div>
                      {/* Tick marks */}
                      <div className="absolute inset-0 flex justify-between px-1">
                        {[0, 25, 50, 75, 100].map(percent => (
                          <div 
                            key={percent}
                            className="w-px h-full bg-gray-600 opacity-50"
                            style={{ marginLeft: percent === 0 ? '-1px' : 'auto' }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right">
                      {Math.max(...hexagonData.map(d => d.count))}
                    </span>
                  </div>
                  <div className="flex justify-between px-10">
                    <span className="text-xs text-gray-500">Low Density</span>
                    <span className="text-xs text-gray-500">High Density</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Shows # of shots per hexagon area (size: {filters.hexagonSize}px)
                </div>
              </div>
            </div>
          )}
          
          {/* Shot Outcomes Legend */}
          <div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Shot Outcomes</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Goals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Saves</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">&nbsp;</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Misses</span>
              </div>
            </div>
          </div>

          {/* Size Legend */}
          {filters.showIndividualShots && (
            <div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Shot Quality (xG)</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-600 border border-white"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-600 border border-white"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Med</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-gray-600 border border-white"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveHockeyHeatMap;