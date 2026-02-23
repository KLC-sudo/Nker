
import React, { useState, useEffect } from 'react';
import { useContent } from '../ContentContext';
import { useCart } from '../CartContext';
import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { content } = useContent();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Still track scroll if we want subtle shadow changes later, but standard style is solid
  // Keeping simplified logic for now: consistent white background

  const handleNavClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    // Internal pages
    if (['home', 'shop', 'about', 'contact'].includes(target)) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Anchor on homepage
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(target.replace('#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(target.replace('#', ''));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headerBg = 'bg-white/95 shadow-md backdrop-blur-sm';
  const linkColor = 'text-gray-700';
  const linkHover = 'hover:text-red-600';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-4">
          {/* Logo only (removed text) */}
          <button
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex-shrink-0 flex items-center gap-3 focus:outline-none"
          >
            <Logo
              src={content.branding.logoTop}
              className="h-auto w-auto object-contain transition-all duration-300"
              style={{ maxHeight: `${content.branding.logoTopSize || 64}px`, maxWidth: `${content.branding.logoTopSize || 64}px` }}
            />
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop nav — grouped right */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={(e) => handleNavClick(e, 'about')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${linkColor} ${linkHover} ${currentPage === 'about' ? 'bg-red-50 text-red-600' : ''}`}
            >
              About
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'contact')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${linkColor} ${linkHover} ${currentPage === 'contact' ? 'bg-red-50 text-red-600' : ''}`}
            >
              Contact
            </button>
            <button
              onClick={(e) => handleNavClick(e, 'shop')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${linkColor} ${linkHover} ${currentPage === 'shop' ? 'bg-red-50 text-red-600' : ''}`}
            >
              E-Shop
            </button>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative ml-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full text-sm transition-all duration-300 hover:scale-105 shadow"
              aria-label="Open cart"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-red-600 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow border border-red-100">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full bg-red-600 text-white"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-600 text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md text-gray-700`}
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white rounded-b-xl shadow-lg">
            {[
              { label: 'Home', page: 'home' },
              { label: 'About', page: 'about' },
              { label: 'E-Shop', page: 'shop' },
              { label: 'Contact', page: 'contact' },
            ].map(({ label, page }) => (
              <button
                key={page}
                onClick={(e) => handleNavClick(e, page)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600 ${currentPage === page ? 'text-red-600 bg-red-50' : 'text-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
