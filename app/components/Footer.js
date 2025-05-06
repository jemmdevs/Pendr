'use client';

import Link from 'next/link';
import { Github, Globe, ArrowRight } from 'lucide-react';
import ContactForm from './ContactForm';

export default function Footer() {
  
  return (
    <footer className="bg-[#2D3748] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Pendr</h3>
            <p className="text-gray-300 mb-6">
              Pendr is your all-in-one toolbox for writing, note-taking, and utility tools.
              Designed to enhance your productivity and simplify your digital tasks.
            </p>
            <div className="flex space-x-4">
              <div className="flex flex-col items-center">
                <Link 
                  href="https://github.com/jemmdevs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#24292E] p-2 rounded-full hover:bg-opacity-80 transition-all mb-1"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </Link>
                <span className="text-xs text-gray-300">My Socials</span>
              </div>
              <div className="flex flex-col items-center">
                <Link 
                  href="https://portfolio-jemmdevs.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#FF8C42] p-2 rounded-full hover:bg-opacity-80 transition-all mb-1"
                  aria-label="Portfolio"
                >
                  <Globe size={20} />
                </Link>
                <span className="text-xs text-gray-300">About Me</span>
              </div>
              <div className="flex flex-col items-center">
                <Link 
                  href="https://jemmdevs.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#3B82F6] p-2 rounded-full hover:bg-opacity-80 transition-all mb-1"
                  aria-label="Personal Blog"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                </Link>
                <span className="text-xs text-gray-300">My Personal Blog</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/text-editor" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Text Editor
                </Link>
              </li>
              <li>
                <Link href="/note-taking" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Note Taking
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/qr-generator" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  QR Generator
                </Link>
              </li>
              <li>
                <Link href="/xml-converter" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  XML Converter
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

        </div>
        
        <div className="border-t border-[#4A5568] mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Pendr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}