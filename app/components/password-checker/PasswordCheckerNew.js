'use client';

import { useState, useRef } from 'react';
import { Lock, Check, X, AlertTriangle, Info, Copy, RefreshCw, Shield } from 'lucide-react';

export default function PasswordChecker() {
  // Password state and UI controls
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0); // 0-100
  const [feedback, setFeedback] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  
  // Password criteria
  const criteria = [
    { id: 'length', label: 'At least 8 characters', met: false },
    { id: 'uppercase', label: 'Contains uppercase letters', met: false },
    { id: 'lowercase', label: 'Contains lowercase letters', met: false },
    { id: 'numbers', label: 'Contains numbers', met: false },
    { id: 'special', label: 'Contains special characters', met: false },
  ];
  
  // Function to evaluate password strength
  const evaluatePassword = (pass) => {
    if (!pass) {
      setStrength(0);
      setFeedback([]);
      setSuggestions([]);
      return;
    }
    
    // Check criteria
    const meetsLength = pass.length >= 8;
    const meetsUppercase = /[A-Z]/.test(pass);
    const meetsLowercase = /[a-z]/.test(pass);
    const meetsNumbers = /[0-9]/.test(pass);
    const meetsSpecial = /[^A-Za-z0-9]/.test(pass);
    
    // Update criteria state
    const updatedCriteria = [
      { id: 'length', label: 'At least 8 characters', met: meetsLength },
      { id: 'uppercase', label: 'Contains uppercase letters', met: meetsUppercase },
      { id: 'lowercase', label: 'Contains lowercase letters', met: meetsLowercase },
      { id: 'numbers', label: 'Contains numbers', met: meetsNumbers },
      { id: 'special', label: 'Contains special characters', met: meetsSpecial },
    ];
    
    // Calculate score
    let score = 0;
    if (meetsLength) score += 20;
    if (meetsUppercase) score += 20;
    if (meetsLowercase) score += 20;
    if (meetsNumbers) score += 20;
    if (meetsSpecial) score += 20;
    
    // Penalty for short passwords
    if (pass.length < 6) score = Math.max(score - 20, 0);
    
    // Bonus for longer passwords
    if (pass.length > 12) score = Math.min(score + 10, 100);
    if (pass.length > 16) score = Math.min(score + 10, 100);
    
    // Penalty for repetitive patterns
    if (/(.+)\\1{2,}/.test(pass)) score = Math.max(score - 15, 0);
    
    // Generate feedback
    const newFeedback = [];
    const newSuggestions = [];
    
    if (score < 50) {
      newFeedback.push('Your password is weak');
    } else if (score < 80) {
      newFeedback.push('Your password is moderate');
    } else {
      newFeedback.push('Your password is strong');
    }
    
    // Generate suggestions based on unmet criteria
    if (!meetsLength) {
      newSuggestions.push('Make your password longer (at least 8 characters)');
    }
    if (!meetsUppercase) {
      newSuggestions.push('Add uppercase letters (A-Z)');
    }
    if (!meetsLowercase) {
      newSuggestions.push('Add lowercase letters (a-z)');
    }
    if (!meetsNumbers) {
      newSuggestions.push('Add numbers (0-9)');
    }
    if (!meetsSpecial) {
      newSuggestions.push('Add special characters (!, @, #, etc.)');
    }
    
    setStrength(score);
    setFeedback(newFeedback);
    setSuggestions(newSuggestions);
  };
  
  // Handle password input changes
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    evaluatePassword(newPassword);
  };
  
  // Function to generate a strong password
  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
    let generatedPassword = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    
    setPassword(generatedPassword);
    evaluatePassword(generatedPassword);
    setShowPassword(true);
  };
  
  // Function to copy password to clipboard
  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  // Helper function to get strength color
  const getStrengthColor = () => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Helper function to get strength text
  const getStrengthText = () => {
    if (strength < 50) return 'Weak';
    if (strength < 80) return 'Moderate';
    return 'Strong';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Password input section */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Enter Password to Check
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="pl-10 pr-16 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter password to check strength"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      
      {/* Strength meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-sm font-medium ${
            strength < 50 ? 'text-red-600' : strength < 80 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
            style={{ width: `${strength}%` }}
          ></div>
        </div>
      </div>
      
      {/* Feedback and suggestions */}
      {password && (
        <div className="mb-6">
          {feedback.length > 0 && (
            <div className={`p-3 rounded-md mb-4 ${
              strength < 50 ? 'bg-red-50 text-red-800' : 
              strength < 80 ? 'bg-yellow-50 text-yellow-800' : 
              'bg-green-50 text-green-800'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {strength < 50 ? (
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  ) : strength < 80 ? (
                    <Info className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Check className="h-5 w-5 text-green-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{feedback[0]}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Password requirements */}
          <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
          <ul className="space-y-1 mb-4">
            {criteria.map((criterion) => (
              <li key={criterion.id} className="flex items-center text-sm">
                {criterion.met ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className={criterion.met ? 'text-gray-700' : 'text-gray-500'}>
                  {criterion.label}
                </span>
              </li>
            ))}
          </ul>
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h4>
              <ul className="space-y-1 mb-2 text-sm text-gray-600">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generatePassword}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Generate Strong Password
        </button>
        
        <button
          onClick={copyToClipboard}
          disabled={!password}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            password 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Copy size={16} className="mr-2" />
          {isCopied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      
      {/* Security tips */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Shield className="h-4 w-4 text-blue-500 mr-2" />
          Password Security Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <Check size={14} className="text-green-500 mr-2 mt-1" />
            Use a unique password for each account
          </li>
          <li className="flex items-start">
            <Check size={14} className="text-green-500 mr-2 mt-1" />
            Consider using a password manager
          </li>
          <li className="flex items-start">
            <Check size={14} className="text-green-500 mr-2 mt-1" />
            Change your passwords regularly
          </li>
          <li className="flex items-start">
            <Check size={14} className="text-green-500 mr-2 mt-1" />
            Enable two-factor authentication when available
          </li>
        </ul>
      </div>
    </div>
  );
}
