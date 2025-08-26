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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-ice group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110" style={{background: 'var(--gradient-navy)'}}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Hockey Puck - Clean design for navigation */}
                <g>
                  {/* Main puck body (ellipse for 3D effect) */}
                  <ellipse cx="16" cy="18" rx="12" ry="5" fill="url(#navPuckShadow)"/>
                  
                  {/* Puck top surface */}
                  <circle cx="16" cy="16" r="12" fill="url(#navTopGradient)" stroke="#fff" strokeWidth="0.8"/>
                  
                  {/* Puck edge highlight */}
                  <circle cx="16" cy="16" r="11" fill="none" stroke="url(#navEdgeHighlight)" strokeWidth="0.6"/>
                  
                  {/* Center dot */}
                  <circle cx="16" cy="16" r="1.8" fill="#bbb" opacity="0.8"/>
                  
                  {/* Subtle texture lines */}
                  <line x1="6" y1="16" x2="26" y2="16" stroke="#ccc" strokeWidth="0.4" opacity="0.6"/>
                  <line x1="16" y1="6" x2="16" y2="26" stroke="#ccc" strokeWidth="0.4" opacity="0.6"/>
                  
                  {/* Additional texture for realism */}
                  <circle cx="16" cy="16" r="8" fill="none" stroke="#ddd" strokeWidth="0.3" opacity="0.4"/>
                  <circle cx="16" cy="16" r="4" fill="none" stroke="#ccc" strokeWidth="0.3" opacity="0.5"/>
                </g>
                
                <defs>
                  {/* Puck shadow/depth */}
                  <radialGradient id="navPuckShadow" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" style={{stopColor:'#777', stopOpacity:0.8}} />
                    <stop offset="100%" style={{stopColor:'#333', stopOpacity:0.4}} />
                  </radialGradient>
                  
                  {/* Puck top gradient - lighter for navigation */}
                  <radialGradient id="navTopGradient" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" style={{stopColor:'#888', stopOpacity:1}} />
                    <stop offset="30%" style={{stopColor:'#666', stopOpacity:1}} />
                    <stop offset="70%" style={{stopColor:'#444', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#222', stopOpacity:1}} />
                  </radialGradient>
                  
                  {/* Edge highlight - lighter for navigation */}
                  <linearGradient id="navEdgeHighlight" x1="20%" y1="20%" x2="80%" y2="80%">
                    <stop offset="0%" style={{stopColor:'#bbb', stopOpacity:0.9}} />
                    <stop offset="50%" style={{stopColor:'#888', stopOpacity:0.5}} />
                    <stop offset="100%" style={{stopColor:'#555', stopOpacity:0.2}} />
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
