'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/generate', label: 'Generate' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' }
  ];

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-green-500/20 shadow-2xl sticky top-0 z-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bangers text-green-400 hover:text-green-300 transition-all duration-300 flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-all duration-300 group-hover:scale-110">
                <span className="text-black font-bold text-sm">📸</span>
              </div>
              <span className="tracking-wide">Virtual Photoshoot</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative transition-all duration-300 px-4 py-2.5 rounded-xl font-medium ${
                  pathname === item.href
                    ? 'text-white bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-600/50 border border-transparent'
                }`}
              >
                
                {pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-xl"></div>
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Enhanced mobile menu button */}
          <div className="md:hidden">
            <button className="text-green-400 hover:text-white p-3 rounded-xl hover:bg-green-500/10 transition-all duration-200 border border-green-500/20 hover:border-green-500/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
