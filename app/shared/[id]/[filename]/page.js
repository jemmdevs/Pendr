'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SharedFilePage({ params }) {
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the file ID from the URL params
    const fileId = params.id;
    const fileName = decodeURIComponent(params.filename);
    
    // Try to find the file in localStorage
    const savedFiles = localStorage.getItem('qrGeneratorFiles');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        const file = parsedFiles.find(f => f.id === fileId);
        
        if (file) {
          setFileData(file);
        } else {
          setError('File not found. It may have been deleted or the link is invalid.');
        }
      } catch (error) {
        console.error('Error parsing saved files:', error);
        setError('Error loading file data.');
      }
    } else {
      setError('No shared files found. The file may have been deleted or the link is invalid.');
    }
    
    setLoading(false);
  }, [params.id, params.filename]);

  // Download the file
  const downloadFile = () => {
    if (!fileData) return;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = fileData.data; // Use the base64 data
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render a preview based on file type
  const renderPreview = () => {
    if (!fileData) return null;
    
    if (fileData.type.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <Image 
            src={fileData.data} 
            alt={fileData.name}
            width={500}
            height={500}
            className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
            unoptimized={true}
          />
        </div>
      );
    } else if (fileData.type === 'application/pdf') {
      return (
        <div className="flex justify-center">
          <iframe 
            src={fileData.data}
            className="w-full h-[600px] rounded-lg shadow-md"
            title={fileData.name}
          />
        </div>
      );
    } else if (fileData.type.startsWith('text/')) {
      // For text files, we could try to display the content
      // But this is simplified and might not work for all text files
      return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md overflow-auto max-h-[500px]">
          <pre className="text-sm whitespace-pre-wrap">
            {/* This is a simplified approach and might not work for all text files */}
            {fileData.data}
          </pre>
        </div>
      );
    } else {
      // For other file types, show a generic file icon
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 rounded-lg p-8 mb-4">
            <FileText size={64} className="text-gray-400" />
          </div>
          <p className="text-gray-600">Preview not available for this file type.</p>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/qr-generator" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to QR Generator
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading file...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fileData.name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {fileData.type} • {(fileData.size / 1024).toFixed(1)} KB
                </p>
              </div>
              
              <button
                onClick={downloadFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
