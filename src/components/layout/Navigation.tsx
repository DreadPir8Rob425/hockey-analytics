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
              <span className="text-white font-bold text-2xl">🏒</span>
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
