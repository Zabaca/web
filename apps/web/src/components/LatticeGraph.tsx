import { useState, useEffect, useRef } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  label: string;
}

interface Edge {
  from: number;
  to: number;
}

const LatticeGraph = () => {
  const [time, setTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.02);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const scale = Math.min(dimensions.width, dimensions.height) * 0.4;

  // Define nodes in a network layout around the center
  // Positions are relative offsets from center, scaled by the scale factor
  const nodePositions: Array<{ x: number; y: number; size: number }> = [
    { x: 0, y: 0, size: 1.0 },        // Center hub (largest)
    { x: -0.7, y: -0.5, size: 0.6 },  // Top-left
    { x: 0.7, y: -0.5, size: 0.55 },  // Top-right
    { x: -0.8, y: 0.3, size: 0.5 },   // Left
    { x: 0.8, y: 0.3, size: 0.5 },    // Right
    { x: -0.3, y: 0.7, size: 0.45 },  // Bottom-left
    { x: 0.3, y: 0.7, size: 0.45 },   // Bottom-right
    { x: 0, y: -0.85, size: 0.4 },    // Top
  ];

  const nodes: Node[] = nodePositions.map((pos, i) => ({
    id: i,
    x: centerX + pos.x * scale,
    y: centerY + pos.y * scale,
    size: pos.size * scale * 0.15,
    label: `node-${i}`
  }));

  // Define edges connecting nodes (from center hub outward and between neighbors)
  const edges: Edge[] = [
    { from: 0, to: 1 },  // Hub to top-left
    { from: 0, to: 2 },  // Hub to top-right
    { from: 0, to: 3 },  // Hub to left
    { from: 0, to: 4 },  // Hub to right
    { from: 0, to: 5 },  // Hub to bottom-left
    { from: 0, to: 6 },  // Hub to bottom-right
    { from: 0, to: 7 },  // Hub to top
    { from: 1, to: 7 },  // Top-left to top
    { from: 2, to: 7 },  // Top-right to top
    { from: 1, to: 3 },  // Top-left to left
    { from: 2, to: 4 },  // Top-right to right
    { from: 3, to: 5 },  // Left to bottom-left
    { from: 4, to: 6 },  // Right to bottom-right
    { from: 5, to: 6 },  // Bottom-left to bottom-right
  ];

  // Generate particles that flow along edges
  const particlesPerEdge = 2;
  const particles = edges.flatMap((edge, edgeIndex) => {
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];

    // Skip if nodes not found
    if (!fromNode || !toNode) return [];

    return Array.from({ length: particlesPerEdge }, (_, particleIndex) => {
      // Calculate position along edge using time
      const speed = 0.3 + (edgeIndex % 3) * 0.1;
      const offset = particleIndex / particlesPerEdge;
      const t = ((time * speed + offset + edgeIndex * 0.1) % 1);

      const x = fromNode.x + (toNode.x - fromNode.x) * t;
      const y = fromNode.y + (toNode.y - fromNode.y) * t;

      // Particle size pulses
      const size = 2 + 1.5 * Math.sin(time * 3 + edgeIndex + particleIndex);

      return {
        key: `${edgeIndex}-${particleIndex}`,
        x,
        y,
        size: Math.max(1, size),
        opacity: 0.6 + 0.3 * Math.sin(time * 2 + particleIndex)
      };
    });
  });

  // Render edges with animated opacity
  const renderedEdges = edges.map((edge, i) => {
    const fromNode = nodes[edge.from];
    const toNode = nodes[edge.to];

    // Skip if nodes not found
    if (!fromNode || !toNode) return null;

    const opacity = 0.4 + 0.2 * Math.sin(time * 2 + i);

    return (
      <line
        key={`edge-${i}`}
        x1={fromNode.x}
        y1={fromNode.y}
        x2={toNode.x}
        y2={toNode.y}
        stroke="url(#edgeGradient)"
        strokeWidth={1.5}
        opacity={opacity}
      />
    );
  }).filter(Boolean);

  // Render nodes with pulsing animation
  const renderedNodes = nodes.map((node, i) => {
    // Center hub has different animation
    const isHub = i === 0;
    const pulseScale = isHub
      ? 1 + 0.08 * Math.sin(time * 1.5)
      : 0.95 + 0.1 * Math.sin(time + i * 0.5);

    const animatedSize = node.size * pulseScale;

    return (
      <g key={`node-${i}`}>
        {/* Glow effect for hub */}
        {isHub && (
          <circle
            cx={node.x}
            cy={node.y}
            r={animatedSize * 1.8}
            fill="url(#hubGlow)"
            opacity={0.5 + 0.2 * Math.sin(time * 1.5)}
          />
        )}
        {/* Node circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r={animatedSize}
          fill={isHub ? 'url(#hubGradient)' : 'url(#nodeGradient)'}
          opacity={isHub ? 1 : 0.85}
        />
        {/* Inner highlight */}
        <circle
          cx={node.x - animatedSize * 0.25}
          cy={node.y - animatedSize * 0.25}
          r={animatedSize * 0.3}
          fill="white"
          opacity={0.2}
        />
      </g>
    );
  });

  // Render particles
  const renderedParticles = particles.map(particle => (
    <circle
      key={particle.key}
      cx={particle.x}
      cy={particle.y}
      r={particle.size}
      fill="#00f0ff"
      opacity={particle.opacity}
    />
  ));

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <defs>
          {/* Edge gradient - flows from green to cyan */}
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ff37d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
          </linearGradient>

          {/* Node gradient - green to purple */}
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ff37d" stopOpacity="1" />
            <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#9013fe" stopOpacity="1" />
          </linearGradient>

          {/* Hub gradient - radial for center glow effect */}
          <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#4ff37d" stopOpacity="1" />
            <stop offset="70%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9013fe" stopOpacity="0.8" />
          </radialGradient>

          {/* Hub glow - outer radiance */}
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ff37d" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9013fe" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Render order: edges first, then particles, then nodes on top */}
        {renderedEdges}
        {renderedParticles}
        {renderedNodes}
      </svg>
    </div>
  );
};

export default LatticeGraph;
