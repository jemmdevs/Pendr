'use client';

import QRCodeGenerator from '../components/qr-generator/QRCodeGenerator';
import Header from '../components/Header';
import Link from 'next/link';

export default function QRGeneratorPage() {
  return (
    <>
      <Header />
      
      {/* Header section with breadcrumb */}
      <div className="bg-gradient-to-b from-white to-[#FFF0E5] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-[#FF8C42] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#FF8C42]">QR Code Generator</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-[#60A5FA] p-3 rounded-lg mr-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <rect x="7" y="7" width="3" height="3"></rect>
                  <rect x="14" y="7" width="3" height="3"></rect>
                  <rect x="7" y="14" width="3" height="3"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748]">
                QR Code Generator <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Beta</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* QR Generator container */}
      <div className="bg-white py-8 px-6 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] shadow-sm p-2 md:p-4">
            <p className="text-gray-600 mb-4">
              Generate QR codes and shareable links for your files. Upload documents, images, and more to create easily scannable QR codes.
            </p>
            <QRCodeGenerator />
          </div>
          
          {/* Tips section */}
          <div className="mt-8 bg-[#EBF4FF] border border-[#93C5FD] rounded-lg p-4 text-[#2D3748]">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#3B82F6]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              QR Code Tips
            </h2>
            <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
              <li>QR codes work best when they have good contrast and are easily scannable</li>
              <li>Keep file sizes reasonable for better performance</li>
              <li>In this beta version, files are stored locally in your browser&apos;s storage</li>
              <li>Shared links will only work on the device where files were uploaded</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
