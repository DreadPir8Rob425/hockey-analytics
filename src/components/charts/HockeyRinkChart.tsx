'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ShotData {
  x: number;
  y: number;
  type: 'goal' | 'shot' | 'miss';
  team: 'home' | 'away';
}

interface HockeyRinkChartProps {
  shotData: ShotData[];
  width?: number;
  height?: number;
}

const HockeyRinkChart = ({ shotData, width = 600, height = 300 }: HockeyRinkChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Mock shot data if none provided
  const mockShotData: ShotData[] = [
    { x: 450, y: 120, type: 'goal', team: 'home' },
    { x: 420, y: 100, type: 'shot', team: 'home' },
    { x: 480, y: 140, type: 'shot', team: 'home' },
    { x: 460, y: 160, type: 'miss', team: 'home' },
    { x: 150, y: 120, type: 'goal', team: 'away' },
    { x: 180, y: 100, type: 'shot', team: 'away' },
    { x: 120, y: 140, type: 'shot', team: 'away' },
    { x: 140, y: 160, type: 'miss', team: 'away' },
  ];

  const data = shotData.length > 0 ? shotData : mockShotData;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    // Hockey rink dimensions (scaled)
    const rinkWidth = width * 0.9;
    const rinkHeight = height * 0.8;
    const rinkX = (width - rinkWidth) / 2;
    const rinkY = (height - rinkHeight) / 2;

    // Create container group
    const g = svg.append('g');

    // Draw rink outline
    g.append('rect')
      .attr('x', rinkX)
      .attr('y', rinkY)
      .attr('width', rinkWidth)
      .attr('height', rinkHeight)
      .attr('fill', '#f8fafc')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 2)
      .attr('rx', 20);

    // Draw center line
    g.append('line')
      .attr('x1', rinkX + rinkWidth / 2)
      .attr('y1', rinkY)
      .attr('x2', rinkX + rinkWidth / 2)
      .attr('y2', rinkY + rinkHeight)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Draw face-off circles
    const faceOffRadius = 20;
    const faceOffPositions = [
      { x: rinkX + rinkWidth * 0.2, y: rinkY + rinkHeight * 0.3 },
      { x: rinkX + rinkWidth * 0.2, y: rinkY + rinkHeight * 0.7 },
      { x: rinkX + rinkWidth * 0.8, y: rinkY + rinkHeight * 0.3 },
      { x: rinkX + rinkWidth * 0.8, y: rinkY + rinkHeight * 0.7 },
      { x: rinkX + rinkWidth * 0.5, y: rinkY + rinkHeight * 0.5 },
    ];

    faceOffPositions.forEach(pos => {
      g.append('circle')
        .attr('cx', pos.x)
        .attr('cy', pos.y)
        .attr('r', faceOffRadius)
        .attr('fill', 'none')
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 2);
    });

    // Draw goal creases
    const creaseWidth = 40;
    const creaseHeight = 8;
    
    // Left goal crease
    g.append('rect')
      .attr('x', rinkX - creaseHeight / 2)
      .attr('y', rinkY + (rinkHeight - creaseWidth) / 2)
      .attr('width', creaseHeight)
      .attr('height', creaseWidth)
      .attr('fill', '#dbeafe')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // Right goal crease
    g.append('rect')
      .attr('x', rinkX + rinkWidth - creaseHeight / 2)
      .attr('y', rinkY + (rinkHeight - creaseWidth) / 2)
      .attr('width', creaseHeight)
      .attr('height', creaseWidth)
      .attr('fill', '#dbeafe')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // Color scale for shot types
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['goal', 'shot', 'miss'])
      .range(['#10b981', '#3b82f6', '#ef4444']);

    // Size scale for shot types
    const sizeScale = d3.scaleOrdinal<string, number>()
      .domain(['goal', 'shot', 'miss'])
      .range([8, 6, 4]);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    // Scale shot coordinates to rink dimensions
    const xScale = d3.scaleLinear()
      .domain([0, 600])
      .range([rinkX, rinkX + rinkWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 300])
      .range([rinkY, rinkY + rinkHeight]);

    // Draw shot markers
    g.selectAll('.shot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'shot')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => sizeScale(d.type))
      .attr('fill', d => colorScale(d.type))
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        tooltip
          .style('visibility', 'visible')
          .text(`${d.type.toUpperCase()} - ${d.team} team`);
        
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', sizeScale(d.type) * 1.5);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        tooltip.style('visibility', 'hidden');
        
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', sizeScale(d.type));
      });

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${rinkX + 20}, ${rinkY + 20})`);

    const legendData = [
      { type: 'goal', label: 'Goals' },
      { type: 'shot', label: 'Shots' },
      { type: 'miss', label: 'Misses' }
    ];

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('circle')
      .attr('cx', 6)
      .attr('cy', 6)
      .attr('r', d => sizeScale(d.type))
      .attr('fill', d => colorScale(d.type))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 6)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d.label);

    // Cleanup tooltip on component unmount
    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-white"
      />
    </div>
  );
};

export default HockeyRinkChart;
