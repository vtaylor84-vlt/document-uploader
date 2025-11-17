import React from 'react';

export const GreenleafLogo: React.FC = () => {
  return (
    <header className="text-center py-4 flex flex-col items-center">
      <svg width="300" height="160" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg" aria-label="Greenleaf Xpress Logo">
        <defs>
          <linearGradient id="greenleaf-leaf-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="greenleaf-road-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="greenleaf-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(0, 10)">
          {/* Bridge / Road */}
          <path 
            d="M 60 100 C 110 80, 190 80, 240 100" 
            stroke="url(#greenleaf-road-grad)" 
            strokeWidth="5" 
            fill="none" 
            filter="url(#greenleaf-glow)"
            strokeLinecap="round"
          />
          <path 
            d="M 40 100 H 260" 
            stroke="#10b981"
            strokeOpacity="0.5"
            strokeWidth="1.5" 
            fill="none"
          />

          {/* Leaf */}
          <g transform="translate(150, 60) scale(1.2)">
            <path 
              d="M 0 -45 C -30 -15, -30 15, 0 45 C 30 15, 30 -15, 0 -45 Z" 
              fill="url(#greenleaf-leaf-grad)" 
              stroke="#14532d"
              strokeWidth="1"
            />
            <path d="M 0 -45 V 45" stroke="#14532d" strokeWidth="1.5" />
          </g>
        </g>
        
        <text 
          x="150" 
          y="130" 
          className="font-orbitron" 
          fontSize="24" 
          fill="#a7f3d0" 
          textAnchor="middle" 
          fontWeight="bold"
          letterSpacing="1"
        >
          GREENLEAF XPRESS
        </text>
        <text 
          x="150" 
          y="148" 
          fontFamily="sans-serif" 
          fontSize="10" 
          fill="#6ee7b7" 
          textAnchor="middle" 
          letterSpacing="0.5"
        >
          WATERLOO, IOWA
        </text>
      </svg>
    </header>
  );
};