'use client';

import PasswordChecker from '../components/password-checker/PasswordChecker';

export default function PasswordCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2D3748] mb-6">Password Strength Checker</h1>
      <p className="text-gray-600 mb-8">
        Verify how secure your passwords are and get recommendations to improve them.
      </p>
      
      <PasswordChecker />
    </div>
  );
}