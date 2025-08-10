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
    pinned: boolean;
    elementId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    pinned: false,
    elementId: null,
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
      console.log('Fetching available teams...');
      const response = await fetch('/api/teams');
      const result = await response.json();
      
      if (response.ok) {
        console.log(`Successfully fetched ${result.teams?.length || 0} teams:`, result.teams);
        // Teams are already sorted alphabetically from the API
        setFilterOptions(prev => ({ ...prev, teams: result.teams || [] }));
        
        // Log a warning if we get fewer teams than expected
        if (result.teams && result.teams.length < 20) {
          console.warn(`Only ${result.teams.length} teams loaded - this might indicate a data sampling issue`);
        }
      } else {
        console.error('Failed to fetch teams - API error:', result.error);
        setError(`Failed to load teams: ${result.error}`);
      }
    } catch (err) {
      console.error('Failed to fetch available teams - network/parsing error:', err);
      setError('Failed to connect to teams API');
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

  // Filter and normalize shot data for consistent analytics view
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
    }).map(shot => {
      // Normalize coordinates so all shots appear to attack the same goal (right side)
      // In hockey, teams switch sides each period, but for analytics we want consistency
      const normalizedShot = { ...shot };
      
      // CORRECTED LOGIC based on debug output:
      // The coordinate system shows:
      // - Positive X = attacking RIGHT goal
      // - Negative X = attacking LEFT goal
      // We want ALL shots normalized to appear as attacking the RIGHT goal (positive X)
      
      // From the debug output we can see:
      // - When DAL is HOME in period 3: negative X coords (attacking left) - need to flip
      // - When DAL is AWAY in period 1: positive X coords (attacking right) - don't flip
      // - When DAL is AWAY in period 2: negative X coords (attacking left) - need to flip
      
      // Simple rule: if X coordinate is negative, the shot is attacking left goal, so flip it
      let shouldFlip = shot.x_cord < 0;
      
      // Enhanced debug logging to understand the data
      if (Math.random() < 0.02) { // Log ~2% of shots to understand patterns
        console.log(`NORMALIZATION DEBUG:`);
        console.log(`  Team: ${shot.team_code} (${shot.is_home_team ? 'HOME' : 'AWAY'})`);
        console.log(`  Period: ${shot.period}`);
        console.log(`  Original coords: (${shot.x_cord.toFixed(1)}, ${shot.y_cord.toFixed(1)})`);
        console.log(`  Should flip: ${shouldFlip} (negative X = attacking left, needs flip)`);
        
        if (shouldFlip) {
          console.log(`  New coords: (${(-shot.x_cord).toFixed(1)}, ${(-shot.y_cord).toFixed(1)})`);
        }
        console.log('---');
      }
      
      if (shouldFlip) {
        normalizedShot.x_cord = -shot.x_cord;  // Flip X coordinate (left-right)
        normalizedShot.y_cord = -shot.y_cord;  // Flip Y coordinate (up-down)
      }
      
      return normalizedShot;
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

  // Enhanced tooltip functions for better mobile/tablet experience
  const showTooltip = useCallback((event: any, data: Record<string, unknown>, elementId: string) => {
    console.log('showTooltip called:', { elementId, data: data.type, eventType: event.type });
    
    // Get container bounds for better positioning
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) {
      console.log('No SVG rect found');
      return;
    }

    // Calculate position relative to the SVG container
    const isTouchEvent = event.type?.includes('touch');
    let x = event.offsetX || event.layerX || 0;
    let y = event.offsetY || event.layerY || 0;
    
    // Simple offset from mouse position
    const offset = isTouchEvent ? { x: 15, y: -60 } : { x: 10, y: -10 };
    x += offset.x;
    y += offset.y;
    
    // Keep tooltip within SVG bounds
    x = Math.max(10, Math.min(x, width - 220));
    y = Math.max(10, Math.min(y, height - 150));
    
    console.log('Setting tooltip state:', {
      visible: true,
      x: x + offset.x,
      y: y + offset.y,
      data: data.type,
      pinned: isTouchEvent,
      elementId,
    });
    
    setTooltip({
      visible: true,
      x: x + offset.x,
      y: y + offset.y,
      data,
      pinned: isTouchEvent,
      elementId,
    });
  }, []);

  const hideTooltip = useCallback((elementId?: string) => {
    setTooltip(prev => {
      // Don't hide if it's pinned and we're not specifically hiding this element
      if (prev.pinned && elementId && prev.elementId !== elementId) {
        return prev;
      }
      return { ...prev, visible: false, pinned: false, elementId: null };
    });
  }, []);

  const toggleTooltipPin = useCallback((event: any, data: Record<string, unknown>, elementId: string) => {
    setTooltip(prev => {
      if (prev.elementId === elementId && prev.visible) {
        // Hide if clicking the same element that's already visible
        return { ...prev, visible: false, pinned: false, elementId: null };
      } else {
        // Show new tooltip with proper positioning
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) {
          console.log('No SVG rect found for click positioning');
          return prev;
        }

        // Calculate position relative to the SVG container
        let x = event.offsetX || event.layerX || 0;
        let y = event.offsetY || event.layerY || 0;
        
        // Simple offset from click position
        const offset = { x: 10, y: -10 };
        x += offset.x;
        y += offset.y;
        
        // Keep tooltip within SVG bounds
        x = Math.max(10, Math.min(x, width - 220));
        y = Math.max(10, Math.min(y, height - 150));
        
        return {
          visible: true,
          x,
          y,
          data,
          pinned: true,
          elementId,
        };
      }
    });
  }, [width, height]);

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

      // Hexagon tooltips and interactions - click only for touch-friendly experience
      hexagons
        .attr('data-element-id', (d, i) => `hexagon-${i}`)
        .on('mouseenter', (event, d) => {
          // Only visual feedback on hover, no tooltip
          d3.select(event.currentTarget).style('opacity', 1);
        })
        .on('mouseleave', (event, d) => {
          // Reset visual state if not pinned
          if (!tooltip.pinned || tooltip.elementId !== `hexagon-${hexagonData.indexOf(d)}`) {
            d3.select(event.currentTarget).style('opacity', 0.7);
          }
        })
        .on('click', (event, d) => {
          event.stopPropagation();
          d3.select(event.currentTarget).style('opacity', 1);
          const elementId = `hexagon-${hexagonData.indexOf(d)}`;
          
          // Calculate advanced metrics for the hexagon
          const shotsOnGoal = d.shots.filter(shot => shot.shot_was_on_goal).length;
          const goals = d.shots.filter(shot => shot.x_goal > 0.95).length;
          const avgDistance = d.shots.reduce((sum, shot) => sum + shot.shot_distance, 0) / d.shots.length;
          const avgAngle = d.shots.reduce((sum, shot) => sum + Math.abs(shot.shot_angle), 0) / d.shots.length;
          const shotTypes = [...new Set(d.shots.map(shot => shot.shot_type))].join(', ');
          const topShooter = d.shots.reduce((acc, shot) => {
            acc[shot.shooter_name] = (acc[shot.shooter_name] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const mostFrequentShooter = Object.entries(topShooter).sort(([,a], [,b]) => b - a)[0];
          const powerPlayShots = d.shots.filter(shot => 
            (shot.home_skaters_on_ice > 6 && shot.is_home_team) ||
            (shot.away_skaters_on_ice > 6 && !shot.is_home_team)
          ).length;
          const evenStrengthShots = d.shots.filter(shot => 
            shot.home_skaters_on_ice === 6 && shot.away_skaters_on_ice === 6
          ).length;
          const emptyNetShots = d.shots.filter(shot => shot.shot_on_empty_net).length;
          
          // Toggle tooltip on click
          toggleTooltipPin(event, {
            type: 'hexagon',
            count: d.count,
            avgXG: d.avgXG.toFixed(3),
            shots: d.shots,
            shotsOnGoal,
            goals,
            avgDistance: avgDistance.toFixed(1),
            avgAngle: avgAngle.toFixed(1),
            shotTypes,
            mostFrequentShooter: mostFrequentShooter ? mostFrequentShooter[0] : 'N/A',
            shooterCount: mostFrequentShooter ? mostFrequentShooter[1] : 0,
            powerPlayShots,
            evenStrengthShots,
            emptyNetShots,
            conversionRate: ((goals / d.count) * 100).toFixed(1),
            onGoalRate: ((shotsOnGoal / d.count) * 100).toFixed(1),
            isPinned: true,
          }, elementId);
        });
        
      // Touch events for mobile
      hexagons.on('touchstart', (event, d) => {
        event.preventDefault();
        event.stopPropagation();
        d3.select(event.currentTarget).style('opacity', 1);
        const elementId = `hexagon-${hexagonData.indexOf(d)}`;
        
        // Calculate the same advanced metrics for touch tooltip
        const shotsOnGoal = d.shots.filter(shot => shot.shot_was_on_goal).length;
        const goals = d.shots.filter(shot => shot.x_goal > 0.95).length;
        const avgDistance = d.shots.reduce((sum, shot) => sum + shot.shot_distance, 0) / d.shots.length;
        const avgAngle = d.shots.reduce((sum, shot) => sum + Math.abs(shot.shot_angle), 0) / d.shots.length;
        const shotTypes = [...new Set(d.shots.map(shot => shot.shot_type))].join(', ');
        const topShooter = d.shots.reduce((acc, shot) => {
          acc[shot.shooter_name] = (acc[shot.shooter_name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const mostFrequentShooter = Object.entries(topShooter).sort(([,a], [,b]) => b - a)[0];
        const powerPlayShots = d.shots.filter(shot => 
          (shot.home_skaters_on_ice > 6 && shot.is_home_team) ||
          (shot.away_skaters_on_ice > 6 && !shot.is_home_team)
        ).length;
        const evenStrengthShots = d.shots.filter(shot => 
          shot.home_skaters_on_ice === 6 && shot.away_skaters_on_ice === 6
        ).length;
        const emptyNetShots = d.shots.filter(shot => shot.shot_on_empty_net).length;
        
        showTooltip(event, {
          type: 'hexagon',
          count: d.count,
          avgXG: d.avgXG.toFixed(3),
          shots: d.shots,
          shotsOnGoal,
          goals,
          avgDistance: avgDistance.toFixed(1),
          avgAngle: avgAngle.toFixed(1),
          shotTypes,
          mostFrequentShooter: mostFrequentShooter ? mostFrequentShooter[0] : 'N/A',
          shooterCount: mostFrequentShooter ? mostFrequentShooter[1] : 0,
          powerPlayShots,
          evenStrengthShots,
          emptyNetShots,
          conversionRate: ((goals / d.count) * 100).toFixed(1),
          onGoalRate: ((shotsOnGoal / d.count) * 100).toFixed(1),
          isPinned: true,
        }, elementId);
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
        .attr('data-element-id', (d, i) => `shot-${i}`)
        .attr('cx', d => xScale(d.x_cord))
        .attr('cy', d => yScale(d.y_cord))
        .attr('r', d => Math.max(3, 2 + d.x_goal * 4)) // Minimum size for touch targets
        .style('fill', d => xgColorScale(d.x_goal))
        .style('stroke', '#333')
        .style('stroke-width', 0.5)
        .style('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseenter', (event, d) => {
          // Only visual feedback on hover, no tooltip
          d3.select(event.currentTarget).attr('r', Math.max(4, (2 + d.x_goal * 4) * 1.2));
        })
        .on('mouseleave', (event, d) => {
          // Reset visual state if not pinned
          if (!tooltip.pinned || tooltip.elementId !== `shot-${highValueShots.indexOf(d)}`) {
            d3.select(event.currentTarget).attr('r', Math.max(3, 2 + d.x_goal * 4));
          }
        })
        .on('click', (event, d) => {
          event.stopPropagation();
          d3.select(event.currentTarget).attr('r', Math.max(4, (2 + d.x_goal * 4) * 1.2));
          const elementId = `shot-${highValueShots.indexOf(d)}`;
          toggleTooltipPin(event, {
            type: 'shot',
            ...d,
            isPinned: true,
          }, elementId);
        })
        .on('touchstart', (event, d) => {
          event.preventDefault();
          event.stopPropagation();
          d3.select(event.currentTarget).attr('r', Math.max(4, (2 + d.x_goal * 4) * 1.2));
          const elementId = `shot-${highValueShots.indexOf(d)}`;
          showTooltip(event, {
            type: 'shot',
            ...d,
            isPinned: true,
          }, elementId);
        });
    }

  }, [filteredData, hexagonData, filters, xScale, yScale, hexbinGenerator, densityColorScale, xgColorScale, loading, drawHockeyRink, showTooltip, hideTooltip, toggleTooltipPin, tooltip.pinned]);

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

  // Close pinned tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (tooltip.pinned && !event.target) {
        hideTooltip();
      }
    };

    if (tooltip.pinned) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [tooltip.pinned, hideTooltip]);

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
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Normalized View (All shots attacking right)
            </span>
          </div>
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

        {/* Enhanced Tooltip */}
        {tooltip.visible && tooltip.data && (
          <div
            className={`absolute bg-gray-900 text-white rounded-lg shadow-xl z-50 transition-all duration-200 max-w-xs ${
              tooltip.pinned 
                ? 'pointer-events-auto border-2 border-blue-400' 
                : 'pointer-events-none'
            }`}
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: tooltip.pinned ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {/* Close button for pinned tooltips */}
            {tooltip.pinned && (
              <button
                onClick={() => hideTooltip()}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                aria-label="Close tooltip"
              >
                ×
              </button>
            )}
            
            <div className="p-3">
              {tooltip.data.type === 'hexagon' ? (
                <div className="space-y-1">
                  <div className="font-semibold text-blue-300 flex items-center">
                    <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
                    Zone Analytics
                  </div>
                  <div className="text-sm space-y-1">
                    {/* Shot Volume & Quality */}
                    <div className="bg-gray-800 rounded p-2 mb-2">
                      <div className="text-xs text-gray-400 mb-1">Shot Volume & Quality</div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Shots:</span>
                        <span className="font-medium text-white">{String(tooltip.data.count || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg xG:</span>
                        <span className="font-medium text-green-400">{String(tooltip.data.avgXG || '0.000')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">On Goal:</span>
                        <span className="font-medium text-blue-400">{String(tooltip.data.shotsOnGoal || 0)} ({String(tooltip.data.onGoalRate || '0')}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Goals:</span>
                        <span className="font-medium text-yellow-400">{String(tooltip.data.goals || 0)} ({String(tooltip.data.conversionRate || '0')}%)</span>
                      </div>
                    </div>
                    
                    {/* Shot Characteristics */}
                    <div className="bg-gray-800 rounded p-2 mb-2">
                      <div className="text-xs text-gray-400 mb-1">Shot Characteristics</div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg Distance:</span>
                        <span className="font-medium">{String(tooltip.data.avgDistance || '0')}ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg Angle:</span>
                        <span className="font-medium">{String(tooltip.data.avgAngle || '0')}°</span>
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        <span className="text-gray-400">Types:</span> {String(tooltip.data.shotTypes || 'N/A')}
                      </div>
                    </div>
                    
                    {/* Game Situations */}
                    <div className="bg-gray-800 rounded p-2 mb-2">
                      <div className="text-xs text-gray-400 mb-1">Game Situations</div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Even Strength:</span>
                        <span className="font-medium">{String(tooltip.data.evenStrengthShots || 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Power Play:</span>
                        <span className="font-medium text-orange-400">{String(tooltip.data.powerPlayShots || 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Empty Net:</span>
                        <span className="font-medium text-red-400">{String(tooltip.data.emptyNetShots || 0)}</span>
                      </div>
                    </div>
                    
                    {/* Top Shooter */}
                    <div className="bg-gray-800 rounded p-2 mb-2">
                      <div className="text-xs text-gray-400 mb-1">Top Shooter</div>
                      <div className="text-xs">
                        <span className="font-medium text-yellow-300">{String(tooltip.data.mostFrequentShooter || 'N/A')}</span>
                        {tooltip.data.shooterCount && Number(tooltip.data.shooterCount) > 0 && (
                          <span className="text-gray-400"> ({String(tooltip.data.shooterCount)} shots)</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700">
                      {tooltip.pinned ? 'Click × to close' : 'Click to pin for details'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-semibold text-yellow-300 flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: typeof tooltip.data.x_goal === 'number' 
                          ? `hsl(${(tooltip.data.x_goal * 60)}, 70%, 50%)` 
                          : '#6b7280'
                      }}
                    ></div>
                    {String(tooltip.data.shooter_name || 'Unknown Player')}
                  </div>
                  <div className="text-sm space-y-1 ml-5">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Team:</span>
                      <span className="font-medium">{String(tooltip.data.team_code || 'N/A')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Period:</span>
                      <span className="font-medium">{String(tooltip.data.period || 'N/A')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">xG:</span>
                      <span className="font-medium text-green-400">
                        {typeof tooltip.data.x_goal === 'number' ? tooltip.data.x_goal.toFixed(3) : '0.000'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Distance:</span>
                      <span className="font-medium">
                        {typeof tooltip.data.shot_distance === 'number' ? tooltip.data.shot_distance.toFixed(1) : '0'}ft
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Type:</span>
                      <span className="font-medium">{String(tooltip.data.shot_type || 'N/A')}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 pt-1 border-t border-gray-700">
                      {tooltip.pinned ? 'Click × to close' : 'Click to pin this tooltip'}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile-friendly tap indicator */}
            <div className="sm:hidden">
              {!tooltip.pinned && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-700 text-xs px-2 py-1 rounded text-center whitespace-nowrap">
                  Tap to pin
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-3">
        {/* Heat Map Legend */}
        {filters.showHexagons && hexagonData.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Heat Map (Shot Density)</h4>
            <div className="flex items-center space-x-4">
              {/* Density color scale */}
              <div className="flex items-center">
                <div className="flex mr-2">
                  <div className="w-3 h-3 bg-orange-100 border border-gray-300" title="Low density (1-2 shots)"></div>
                  <div className="w-3 h-3 bg-orange-200 border border-gray-300" title="Low-medium density"></div>
                  <div className="w-3 h-3 bg-orange-400 border border-gray-300" title="Medium density"></div>
                  <div className="w-3 h-3 bg-orange-600 border border-gray-300" title="High density"></div>
                  <div className="w-3 h-3 bg-red-600 border border-gray-300" title="Very high density (10+ shots)"></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Few shots → Many shots</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Max: {Math.max(...hexagonData.map(d => d.count))} shots/area
              </div>
            </div>
          </div>
        )}

        {/* Individual Shots Legend */}
        {filters.showIndividualShots && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">High-Value Shots (xG &gt; 0.15)</h4>
            <div className="flex items-center space-x-4">
              {/* xG color scale */}
              <div className="flex items-center">
                <div className="flex mr-2">
                  <div className="w-3 h-3 bg-purple-900 rounded-full border border-gray-300" title="xG: 0.15-0.3"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full border border-gray-300" title="xG: 0.3-0.5"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full border border-gray-300" title="xG: 0.5-0.7"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full border border-gray-300" title="xG: 0.7-0.9"></div>
                  <div className="w-3 h-3 bg-yellow-200 rounded-full border border-gray-300" title="xG: 0.9+"></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Low xG → High xG</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Circle size = xG value
              </div>
            </div>
          </div>
        )}

        {/* Rink Elements Legend */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rink Elements</h4>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-1 bg-blue-500 mr-2" style={{ borderStyle: 'dashed' }}></div>
              <span>Center Line</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-1 bg-red-600 mr-2"></div>
              <span>Goal Lines</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 border border-blue-500 mr-2"></div>
              <span>Goals</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-gray-500 rounded-full mr-2"></div>
              <span>Face-off Circles</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex space-x-4">
            <span>Total Shots: <strong>{filteredData.length.toLocaleString()}</strong></span>
            <span>Total xG: <strong>{filteredData.reduce((sum, shot) => sum + shot.x_goal, 0).toFixed(2)}</strong></span>
            {filteredData.length > 0 && (
              <span>Avg xG/Shot: <strong>{(filteredData.reduce((sum, shot) => sum + shot.x_goal, 0) / filteredData.length).toFixed(3)}</strong></span>
            )}
          </div>
          {filters.teams && filters.teams.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {filters.teams.length === 1 ? filters.teams[0] : `${filters.teams.length} teams selected`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveHockeyHeatMap;
