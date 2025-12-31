'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const WaveVisual: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous
    svg.selectAll("*").remove();

    const group = svg.append("g");
    
    // Config
    const points = 50;
    const waves = 3;
    const spacing = width / points;

    // Generate line generator
    const line = d3.line<{x: number, y: number}>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);

    const data: {x: number, y: number}[][] = [];

    // Initialize lines
    for(let w = 0; w < waves; w++) {
      const waveData = [];
      for (let i = 0; i <= points + 2; i++) {
        waveData.push({ x: i * spacing, y: height / 2 });
      }
      data.push(waveData);
    }

    const paths = group.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d, i) => i === 0 ? "rgba(255,255,255,0.6)" : i === 1 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)")
      .attr("stroke-width", 2);

    let time = 0;

    const animate = () => {
      time += 0.05;

      const newData = data.map((wave, wIndex) => {
        return wave.map((p, i) => {
          // Math for smooth wave motion
          const offset = (i * 0.2) - time + (wIndex * 1.5);
          const y = (height / 2) + Math.sin(offset) * (40 + wIndex * 20) * Math.sin(time * 0.1 + i * 0.05);
          return { x: p.x, y };
        });
      });

      paths.data(newData).attr("d", line);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <svg 
      ref={svgRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      preserveAspectRatio="none"
    />
  );
};

export default WaveVisual;