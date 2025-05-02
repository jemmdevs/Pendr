'use client';

import { useState, useEffect } from 'react';
import { Copy, ArrowDown, RefreshCw } from 'lucide-react';

export default function Base64Tool() {
  const [inputText, setInputText] = useState('');
  const [encodeMode, setEncodeMode] = useState(true); // true = encode, false = decode
  const [base64Result, setBase64Result] = useState('');
  const [reversedBase64, setReversedBase64] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to safely decode base64 to UTF-8
  const safeBase64Decode = (base64String) => {
    try {
      // First, check if the string is valid base64
      // Base64 length should be a multiple of 4
      if (base64String.length % 4 !== 0) {
        throw new Error("Invalid Base64 length");
      }
      
      // Base64 should only contain A-Z, a-z, 0-9, +, /, and = for padding
      if (!/^[A-Za-z0-9+/=]+$/.test(base64String)) {
        throw new Error("Invalid Base64 characters");
      }
      
      // Try to decode
      const binary = atob(base64String);
      
      // Convert to UTF-8
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      return new TextDecoder().decode(bytes);
    } catch (error) {
      console.error("Base64 decode error:", error);
      throw new Error("Failed to decode Base64 string: " + error.message);
    }
  };

  // Process the input text based on the selected mode
  useEffect(() => {
    // Clear any previous error
    setErrorMessage('');
    
    if (inputText) {
      if (encodeMode) {
        // Encode mode: UTF-8 -> Base64 -> Reversed Base64
        try {
          // Encode to base64
          const encoder = new TextEncoder();
          const bytes = encoder.encode(inputText);
          const base64 = btoa(String.fromCharCode(...bytes));
          setBase64Result(base64);
          
          // Reverse the base64 string
          const reversed = base64.split('').reverse().join('');
          setReversedBase64(reversed);
          
          setOriginalText('');
        } catch (error) {
          console.error('Encoding error:', error);
          setErrorMessage('Error encoding text: ' + error.message);
          setBase64Result('');
          setReversedBase64('');
        }
      } else {
        // Decode mode: Reversed Base64 -> Base64 -> UTF-8
        try {
          // Reverse the string back
          const unreversed = inputText.split('').reverse().join('');
          setBase64Result(unreversed);
          
          // Decode from base64
          const decoded = safeBase64Decode(unreversed);
          setOriginalText(decoded);
          
          setReversedBase64('');
        } catch (error) {
          console.error('Decoding error:', error);
          setErrorMessage('Invalid reversed Base64 string: ' + error.message);
          setBase64Result(unreversed => {
            // Still show the unreversed string even if we can't decode it
            return inputText.split('').reverse().join('');
          });
          setOriginalText('');
        }
      }
    } else {
      // Clear results if input is empty
      setBase64Result('');
      setReversedBase64('');
      setOriginalText('');
    }
  }, [inputText, encodeMode]);

  // Copy text to clipboard
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyMessage(`${type} copied to clipboard!`);
        setTimeout(() => setCopyMessage(''), 2000);
      },
      () => {
        setCopyMessage('Failed to copy text');
        setTimeout(() => setCopyMessage(''), 2000);
      }
    );
  };

  // Toggle between encode and decode modes
  const toggleMode = () => {
    setEncodeMode(!encodeMode);
    setInputText('');
    setBase64Result('');
    setReversedBase64('');
    setOriginalText('');
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mode selector */}
      <div className="mb-6 flex justify-center">
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setEncodeMode(true)}
            className={`px-4 py-2 rounded-md ${
              encodeMode
                ? 'bg-white text-[#3B82F6] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            } transition-all font-medium`}
          >
            Encode Text to Reversed Base64
          </button>
          <button
            onClick={() => setEncodeMode(false)}
            className={`px-4 py-2 rounded-md ${
              !encodeMode
                ? 'bg-white text-[#3B82F6] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            } transition-all font-medium`}
          >
            Decode Reversed Base64 to Text
          </button>
        </div>
      </div>

      {/* Input text area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {encodeMode ? 'Enter UTF-8 Text to Encode' : 'Enter Reversed Base64 to Decode'}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={encodeMode ? 'Type or paste text here...' : 'Paste reversed Base64 here...'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent min-h-[100px] text-gray-800 bg-white"
          rows={5}
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Flow icon */}
      <div className="flex justify-center my-6">
        <div className="p-2 rounded-full bg-gray-100">
          <ArrowDown className="text-gray-500" size={24} />
        </div>
      </div>
      
      {/* Results section */}
      {encodeMode ? (
        <>
          {/* Encode mode results */}
          {base64Result && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Base64 Encoded Result
                </label>
                <button 
                  onClick={() => handleCopy(base64Result, 'Base64')}
                  className="p-1 text-gray-500 hover:text-[#3B82F6] transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-mono break-all">
                {base64Result}
              </div>
            </div>
          )}
          
          {/* Flow icon */}
          {reversedBase64 && (
            <div className="flex justify-center my-4">
              <div className="p-2 rounded-full bg-gray-100">
                <ArrowDown className="text-gray-500" size={24} />
              </div>
            </div>
          )}
          
          {reversedBase64 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reversed Base64 (Final Result)
                </label>
                <button 
                  onClick={() => handleCopy(reversedBase64, 'Reversed Base64')}
                  className="p-1 text-gray-500 hover:text-[#3B82F6] transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-mono break-all">
                {reversedBase64}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Decode mode results */}
          {base64Result && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Unreversed Base64
                </label>
                <button 
                  onClick={() => handleCopy(base64Result, 'Unreversed Base64')}
                  className="p-1 text-gray-500 hover:text-[#3B82F6] transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-mono break-all">
                {base64Result}
              </div>
            </div>
          )}
          
          {/* Flow icon */}
          {originalText && (
            <div className="flex justify-center my-4">
              <div className="p-2 rounded-full bg-gray-100">
                <ArrowDown className="text-gray-500" size={24} />
              </div>
            </div>
          )}
          
          {originalText && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Original UTF-8 Text (Final Result)
                </label>
                <button 
                  onClick={() => handleCopy(originalText, 'Original text')}
                  className="p-1 text-gray-500 hover:text-[#3B82F6] transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 break-words">
                {originalText}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Show copy message */}
      {copyMessage && (
        <div className="mt-4 p-2 bg-green-100 text-green-600 rounded-md text-center">
          {copyMessage}
        </div>
      )}
      
      {/* Reset button */}
      {(base64Result || reversedBase64 || originalText || errorMessage) && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              setInputText('');
              setBase64Result('');
              setReversedBase64('');
              setOriginalText('');
              setErrorMessage('');
            }}
            className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      )}
      
      {/* Mode toggle button */}
      <div className="mt-8 border-t border-gray-200 pt-6 flex justify-center">
        <button
          onClick={toggleMode}
          className="px-4 py-2 rounded-md text-[#3B82F6] hover:bg-blue-50 transition-colors"
        >
          Switch to {encodeMode ? 'Decode' : 'Encode'} Mode
        </button>
      </div>
    </div>
  );
} 