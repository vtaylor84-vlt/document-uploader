import React from 'react';

export const BstLogo: React.FC = () => {
  return (
    <header className="text-center py-4 flex flex-col items-center">
      <svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" aria-label="BST Expedite Inc Logo">
        <defs>
          <linearGradient id="bst-truck-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <filter id="bst-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Truck Body with Glow */}
        <g filter="url(#bst-glow)">
          {/* Main Trailer */}
          <path 
            d="M 110 40 L 280 40 L 280 95 L 110 95 Z" 
            fill="url(#bst-truck-grad)"
            fillOpacity="0.1"
            stroke="url(#bst-truck-grad)" 
            strokeWidth="2.5" 
          />
          {/* Cab */}
          <path 
            d="M 30 70 L 110 70 L 110 95 L 85 95 L 60 70 L 30 70 Z" 
            fill="#1e293b"
            stroke="url(#bst-truck-grad)" 
            strokeWidth="2.5" 
          />
          {/* Windshield */}
           <path 
            d="M 65 70 L 80 70 L 100 50 L 85 50 Z" 
            fill="url(#bst-truck-grad)"
            fillOpacity="0.2"
          />
          {/* Speed Lines */}
          <path d="M 5 82 H 50" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 20 88 H 40" stroke="#38bdf8" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        
        {/* Wheels */}
        <g stroke="#818cf8" strokeWidth="1.5" fill="#1e293b">
            <circle cx="95" cy="100" r="10" />
            <circle cx="190" cy="100" r="10" />
            <circle cx="230" cy="100" r="10" />
        </g>

        <text 
          x="150" 
          y="135" 
          className="font-orbitron"
          fontSize="22" 
          fill="#38bdf8" 
          textAnchor="middle" 
          fontWeight="900" 
          letterSpacing="1.5"
          style={{ textShadow: '0 0 8px #38bdf8' }}
        >
          BST EXPEDITE INC
        </text>
      </svg>
    </header>
  );
};