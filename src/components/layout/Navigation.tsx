'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Games' },
    { href: '/teams', label: 'Teams' },
    { href: '/players', label: 'Players' },
    { href: '/sandbox', label: 'Sandbox' },
  ];

  return (
    <nav className="bg-white shadow-ice border-b-2 border-blue-100 sticky top-0 z-50" style={{background: 'var(--gradient-hero)'}}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="group-hover:scale-105 transition-all duration-300 flex items-center">
              <svg width="80" height="60" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3D Hockey Puck - Cleaned up design */}
                <g>
                  {/* Drop shadow for depth */}
                  <ellipse cx="25" cy="20" rx="14" ry="8" fill="#000" opacity="0.15"/>
                  
                  {/* Puck side (cylinder wall) - cleaner shape */}
                  <path d="M 8 18 Q 8 26 24 26 Q 40 26 40 18 L 40 14 Q 40 10 24 10 Q 8 10 8 14 Z" 
                        fill="url(#puckSide)" stroke="#333" strokeWidth="0.5"/>
                  
                  {/* Left edge highlight */}
                  <path d="M 8 14 Q 8 10 24 10 L 8 14" 
                        fill="none" stroke="#777" strokeWidth="1" opacity="0.8"/>
                  
                  {/* Right edge shadow */}
                  <path d="M 40 14 Q 40 10 24 10 L 40 14" 
                        fill="none" stroke="#111" strokeWidth="1" opacity="0.7"/>
                  
                  {/* Puck bottom ellipse */}
                  <ellipse cx="24" cy="18" rx="16" ry="8" fill="url(#puckBottom)" stroke="#000" strokeWidth="0.5" opacity="0.8"/>
                  
                  {/* Puck top surface */}
                  <ellipse cx="24" cy="14" rx="16" ry="8" fill="url(#puckTop)" stroke="#555" strokeWidth="0.8"/>
                  
                  {/* Top rim highlight */}
                  <ellipse cx="24" cy="14" rx="16" ry="8" fill="none" stroke="url(#rimHighlight)" strokeWidth="1.2"/>
                  
                  {/* Subtle top surface highlight */}
                  <ellipse cx="20" cy="12" rx="8" ry="4" fill="none" stroke="#888" strokeWidth="0.6" opacity="0.5"/>
                  
                  {/* Center dot */}
                  <ellipse cx="24" cy="14" rx="1.2" ry="0.8" fill="#555" opacity="0.7"/>
                </g>
                
                <defs>
                  {/* Cylinder side gradient */}
                  <linearGradient id="puckSide" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#1a1a1a'}} />
                    <stop offset="15%" style={{stopColor:'#333'}} />
                    <stop offset="50%" style={{stopColor:'#555'}} />
                    <stop offset="85%" style={{stopColor:'#333'}} />
                    <stop offset="100%" style={{stopColor:'#1a1a1a'}} />
                  </linearGradient>
                  
                  {/* Puck bottom (darker) */}
                  <radialGradient id="puckBottom" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" style={{stopColor:'#222'}} />
                    <stop offset="100%" style={{stopColor:'#000'}} />
                  </radialGradient>
                  
                  {/* Puck top surface */}
                  <radialGradient id="puckTop" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" style={{stopColor:'#666'}} />
                    <stop offset="30%" style={{stopColor:'#444'}} />
                    <stop offset="70%" style={{stopColor:'#333'}} />
                    <stop offset="100%" style={{stopColor:'#222'}} />
                  </radialGradient>
                  
                  {/* Top highlight */}
                  <linearGradient id="topHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#888', stopOpacity:0.8}} />
                    <stop offset="50%" style={{stopColor:'#666', stopOpacity:0.4}} />
                    <stop offset="100%" style={{stopColor:'#444', stopOpacity:0.1}} />
                  </linearGradient>
                  
                  {/* Rim highlight - contrasting edge */}
                  <linearGradient id="rimHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#aaa', stopOpacity:0.9}} />
                    <stop offset="25%" style={{stopColor:'#777', stopOpacity:0.7}} />
                    <stop offset="75%" style={{stopColor:'#444', stopOpacity:0.5}} />
                    <stop offset="100%" style={{stopColor:'#222', stopOpacity:0.8}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black" style={{color: 'var(--deep-navy)'}}>
                Cold Hard Puck
              </span>
              <span className="text-sm font-bold" style={{color: 'var(--professional-blue)'}}>
                Hockey Analytics Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 group"
                style={{
                  color: 'var(--steel-gray)'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--gradient-secondary)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--steel-gray)';
                }}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 rounded-2xl text-white hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110"
              style={{background: 'var(--gradient-secondary)'}}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-blue-100" style={{background: 'var(--gradient-hero)'}}>
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 mx-2 hover:shadow-lg"
                  style={{color: 'var(--steel-gray)'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--gradient-secondary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--steel-gray)';
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
