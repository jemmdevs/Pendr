'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Handle window resize and set initial width
  useEffect(() => {
    // Set initial window width once component is mounted
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (sidebar && !sidebar.contains(event.target) && menuButton && !menuButton.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 border-b border-neutral-200 relative z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and mobile menu button */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-[#FF8C42] hover:text-[#E67539] transition-colors">
            Pendr
          </Link>
          
          {/* Desktop navigation menu - hidden on mobile */}
          <nav className="ml-8 hidden lg:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="/text-editor" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Text Editor
                </Link>
              </li>
              <li>
                <Link href="/note-taking" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/base64-tool" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Base64 Tool
                </Link>
              </li>
              <li>
                <Link href="/bill-split" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Bill Split
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href="/password-checker" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Password Checker
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Invoices
                </Link>
              </li>
              <li>
                <Link href="/qr-generator" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  QR Generator
                </Link>
              </li>
              <li>
                <Link href="/xml-converter" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  XML Converter
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Mobile menu button - visible only on mobile */}
        <button
          id="mobile-menu-button"
          className="lg:hidden text-gray-500 hover:text-[#FF8C42] transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Authentication buttons */}
        <div className="hidden lg:block">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-md hover:bg-[#2563EB] transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
      
      {/* Mobile sidebar menu */}
      <div 
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="text-2xl font-bold text-[#FF8C42]" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Pendr
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/text-editor" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Text Editor
                </Link>
              </li>
              <li>
                <Link 
                  href="/note-taking" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link 
                  href="/base64-tool" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Base64 Tool
                </Link>
              </li>
              <li>
                <Link 
                  href="/bill-split" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bill Split
                </Link>
              </li>
              <li>
                <Link 
                  href="/calculator" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calculator
                </Link>
              </li>
              <li>
                <Link 
                  href="/password-checker" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Password Checker
                </Link>
              </li>
              <li>
                <Link 
                  href="/invoice-generator" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Invoices
                </Link>
              </li>
              <li>
                <Link 
                  href="/qr-generator" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  QR Generator
                </Link>
              </li>
              <li>
                <Link 
                  href="/xml-converter" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  XML Converter
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="block py-2 text-gray-600 hover:text-[#FF8C42] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="mt-8">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full bg-[#3B82F6] text-white px-4 py-2 rounded-md hover:bg-[#2563EB] transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}