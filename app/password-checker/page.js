'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield } from 'lucide-react';
import PasswordChecker from '../components/password-checker/PasswordCheckerNew';

// This is a simplified version without importing the problematic component
export default function PasswordCheckerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main content */}
      <main className="flex-1">
        {/* Header section with breadcrumb */}
        <div className="bg-gradient-to-b from-white to-[#FFF0E5] py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-[#FF8C42] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[#FF8C42]">Password Checker</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-[#A78BFA] p-3 rounded-lg mr-4 text-white">
                  <Shield size={24} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
                  Password Strength Checker
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        {/* Password Checker Component */}
        <div className="bg-white py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] shadow-sm p-6">
              <p className="text-gray-600 mb-4">
                Check your password strength and get recommendations to improve your online security.
              </p>
              <PasswordChecker />
            </div>
            
            {/* Tips section */}
            <div className="mt-8 bg-[#EBF4FF] border border-[#93C5FD] rounded-lg p-4 text-[#2D3748]">
              <h2 className="text-lg font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#3B82F6]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Password Security Tips
              </h2>
              <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
                <li>Use a combination of uppercase, lowercase, numbers, and special characters</li>
                <li>Avoid using common words or personal information</li>
                <li>Make your passwords at least 12 characters long</li>
                <li>Use a different password for each account</li>
                <li>Consider using a password manager to generate and store secure passwords</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}