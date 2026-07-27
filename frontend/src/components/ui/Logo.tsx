import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 48 }: LogoProps) {
  return (
    <div 
      className={`flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width="65%" 
        height="65%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stem */}
        <rect x="47" y="68" width="6" height="32" fill="#044c23" />
        
        {/* Leaf on stem */}
        <polygon points="53,78 68,68 68,76 53,86" fill="#044c23" />

        {/* Green Bud (Background white, outline green) */}
        <path 
          d="M 28 50 A 22 22 0 0 0 72 50 Q 72 15 50 5 Q 28 15 28 50 Z" 
          fill="white" 
          stroke="#044c23" 
          strokeWidth="6" 
          strokeLinejoin="round" 
        />

        {/* Golden Petals (Hollow ribbon shape overlapping bud) */}
        <path 
          d="M 5 35 Q 25 10, 50 40 Q 75 10, 95 35 Q 80 65, 50 55 Q 20 65, 5 35 Z" 
          fill="white" 
          stroke="#967010" 
          strokeWidth="6" 
          strokeLinejoin="round" 
        />
      </svg>
    </div>
  );
}
