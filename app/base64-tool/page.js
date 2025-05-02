import Base64Tool from '../components/base64-tool/Base64Tool';
import Header from '../components/Header';
import { Code } from 'lucide-react';
import Link from 'next/link';

export default function Base64ToolPage() {
  return (
    <>
      <Header />
      
      {/* Header section with breadcrumb */}
      <div className="bg-gradient-to-b from-white to-[#FFF0E5] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-[#FF8C42] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#FF8C42]">Base64 Tool</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-[#FFA07A] p-3 rounded-lg mr-4 text-white">
                <Code size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
                Base64 Encoder/Decoder
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Base64 Tool container */}
      <div className="bg-white py-8 px-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] shadow-sm p-2 md:p-4">
            <Base64Tool />
          </div>
          
          {/* Tips section */}
          <div className="mt-8 bg-[#EBF4FF] border border-[#93C5FD] rounded-lg p-4 text-[#2D3748]">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#3B82F6]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Base64 Tool Tips
            </h2>
            <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
              <li>Enter UTF-8 text to encode it to Base64, reverse it, and get the result</li>
              <li>Enter reversed Base64 to decode it back to the original UTF-8 text</li>
              <li>This tool is useful for simple text obfuscation or encoding challenges</li>
              <li>Copy buttons allow you to easily copy the result to your clipboard</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
} 