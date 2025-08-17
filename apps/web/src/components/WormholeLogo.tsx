import { useState, useEffect, useRef } from 'react';

const WormholeLogo = () => {
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
  const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.4;

  // Wormhole effect using animated circles
  const rings = Array.from({ length: 8 }, (_, i) => {
    const radius = maxRadius * (0.3 + 0.7 * (i / 7));
    const opacity = 0.2 + 0.8 * (1 - i / 7);
    const strokeWidth = 2 + i / 7 * 4;
    const animationOffset = i * 0.5;
    
    return (
      <circle
        key={i}
        cx={centerX}
        cy={centerY}
        r={radius * (0.8 + 0.2 * Math.sin(time + animationOffset))}
        fill="none"
        stroke="url(#wormholeGradient)"
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    );
  });

  // Particle effects for the wormhole
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = i / 20 * Math.PI * 2 + time;
    const distance = maxRadius * 0.2 + maxRadius * 0.6 * Math.sin(time * 2 + i);
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const size = 2 + 3 * Math.sin(time * 3 + i);
    
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={Math.max(0, size)}
        fill="#00f0ff"
        opacity={0.7}
      />
    );
  });
  
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
          <linearGradient id="wormholeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="50%" stopColor="#9013fe" stopOpacity="1" />
            <stop offset="100%" stopColor="#50e3c2" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#9013fe" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#50e3c2" stopOpacity="0" />
          </radialGradient>
        </defs>
        {rings}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius * 0.15}
          fill="url(#coreGradient)"
        />
        {particles}
      </svg>
    </div>
  );
};

export default WormholeLogo;