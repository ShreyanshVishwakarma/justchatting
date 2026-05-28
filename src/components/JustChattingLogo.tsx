import React from 'react';

interface JustChattingLogoProps {
  size?: number;
  className?: string;
}

export const JustChattingLogo: React.FC<JustChattingLogoProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Handrawn style background box */}
      <rect x="25" y="25" width="462" height="462" rx="20" fill="white" stroke="#2d2d2d" strokeWidth="25" strokeLinejoin="round" className="origin-center rotate-[-3deg]"/>
      <rect x="25" y="25" width="462" height="462" rx="40" fill="transparent" stroke="#2d2d2d" strokeWidth="15" strokeLinejoin="round" className="origin-center rotate-[2deg]"/>
      
      {/* Chat bubble 1 */}
      <path d="M 120 160 C 130 110, 360 110, 370 160 C 380 210, 180 230, 160 210 L 100 240 L 120 190 C 100 180, 110 160, 120 160 Z" fill="white" stroke="#2d2d2d" strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="180" cy="170" r="16" fill="#2d2d2d"/>
      <circle cx="250" cy="170" r="16" fill="#2d2d2d"/>
      <circle cx="320" cy="170" r="16" fill="#2d2d2d"/>
      
      {/* Chat bubble 2 */}
      <path d="M 390 320 C 370 270, 150 260, 130 310 C 110 360, 310 390, 340 370 L 410 400 L 380 350 C 400 340, 405 325, 390 320 Z" fill="#2d2d2d" stroke="#2d2d2d" strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="330" cy="330" r="16" fill="white"/>
      <circle cx="260" cy="330" r="16" fill="white"/>
      <circle cx="190" cy="330" r="16" fill="white"/>
    </svg>
  );
};

export default JustChattingLogo;
