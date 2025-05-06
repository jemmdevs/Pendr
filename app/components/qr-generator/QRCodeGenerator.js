'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { QRCodeSVG } from 'qrcode.react';
import { Upload, Copy, Download, Trash, Link as LinkIcon } from 'lucide-react';

export default function QRCodeGenerator() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareableLink, setShareableLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const linkInputRef = useRef(null);
  
  // Load saved files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('qrGeneratorFiles');
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        // We need to recreate the File objects since they can't be serialized
        const reconstructedFiles = parsedFiles.map(file => ({
          ...file,
          // We can't restore the actual file data, but we can keep the metadata
          preview: file.preview,
          uploaded: true
        }));
        setFiles(reconstructedFiles);
        
        // Select the first file if available
        if (reconstructedFiles.length > 0) {
          setSelectedFile(reconstructedFiles[0]);
          setShareableLink(reconstructedFiles[0].shareableLink);
        }
      } catch (error) {
        console.error('Error parsing saved files:', error);
      }
    }
  }, []);

  // Handle file drop
  const onDrop = useCallback(acceptedFiles => {
    // Convert files to base64 for storage in localStorage
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        const newFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substring(2),
          data: base64Data,
          lastModified: file.lastModified,
          uploaded: true
        };
        
        // Generate shareable link
        const host = window.location.origin;
        const shareableLink = `${host}/shared/${newFile.id}/${encodeURIComponent(newFile.name)}`;
        newFile.shareableLink = shareableLink;
        
        // Add to files state
        setFiles(prevFiles => {
          const updatedFiles = [...prevFiles, newFile];
          // Save to localStorage
          saveFilesToLocalStorage(updatedFiles);
          return updatedFiles;
        });
        
        // Select the file if none is selected
        if (!selectedFile) {
          setSelectedFile(newFile);
          setShareableLink(shareableLink);
          setIsUploading(false);
        }
      };
      
      setIsUploading(true);
      reader.readAsDataURL(file);
    });
  }, [selectedFile]);
  
  // Save files to localStorage
  const saveFilesToLocalStorage = (filesToSave) => {
    try {
      localStorage.setItem('qrGeneratorFiles', JSON.stringify(filesToSave));
    } catch (error) {
      console.error('Error saving files to localStorage:', error);
      // If we hit storage limits, remove the oldest files
      if (error.name === 'QuotaExceededError') {
        const reducedFiles = filesToSave.slice(Math.max(filesToSave.length - 5, 0));
        localStorage.setItem('qrGeneratorFiles', JSON.stringify(reducedFiles));
        setFiles(reducedFiles);
        alert('Storage limit reached. Only keeping the 5 most recent files.');
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'text/plain': [],
      'application/zip': [],
      'application/x-zip-compressed': []
    }
  });

  // Generate a shareable link for the file
  const generateShareableLink = (file) => {
    // Create a link based on the current origin
    const host = window.location.origin;
    const link = `${host}/shared/${file.id}/${encodeURIComponent(file.name)}`;
    
    // Update the file object with the link
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.map(f => 
        f.id === file.id 
          ? { ...f, shareableLink: link, uploaded: true } 
          : f
      );
      
      // Save updated files to localStorage
      saveFilesToLocalStorage(updatedFiles);
      return updatedFiles;
    });
    
    // Update the selected file if it's the current one
    if (selectedFile && selectedFile.id === file.id) {
      setSelectedFile(prev => ({ ...prev, shareableLink: link, uploaded: true }));
      setShareableLink(link);
    }
    
    return link;
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Select a file from the list
  const handleSelectFile = (file) => {
    setSelectedFile(file);
    if (file.shareableLink) {
      setShareableLink(file.shareableLink);
    } else {
      const link = generateShareableLink(file);
      setShareableLink(link);
    }
  };

  // Remove a file from the list
  const handleRemoveFile = (fileId, e) => {
    e.stopPropagation();
    
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    
    // Update localStorage
    saveFilesToLocalStorage(updatedFiles);
    
    // If the removed file was selected, select another one or clear selection
    if (selectedFile && selectedFile.id === fileId) {
      if (updatedFiles.length > 0) {
        handleSelectFile(updatedFiles[0]);
      } else {
        setSelectedFile(null);
        setShareableLink('');
      }
    }
  };

  // Download QR code as image
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      // Download the PNG
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${selectedFile.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Beta Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">β</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Beta Feature</h3>
            <div className="text-sm text-blue-700">
              <p>This QR Generator is currently in beta. Files are only stored locally in your browser and shared links will only work on this device. Full functionality with cross-device sharing will be available in a future update.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* File Upload Section */}
        <div className="p-6 bg-gray-50 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
          
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag & drop files here, or click to select files
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports images, PDFs, documents, and more
            </p>
          </div>
          
          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Your Files</h3>
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {files.map(file => (
                  <li 
                    key={file.id}
                    onClick={() => handleSelectFile(file)}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      selectedFile && selectedFile.id === file.id 
                        ? 'bg-blue-100' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={file.preview} 
                          alt={file.name}
                          className="h-10 w-10 object-cover rounded"
                          onLoad={() => { URL.revokeObjectURL(file.preview) }}
                        />
                      ) : (
                        <div className="text-gray-500 text-xs uppercase">{file.name.split('.').pop()}</div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                        {file.uploaded && <span className="ml-2 text-green-600">• Uploaded</span>}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleRemoveFile(file.id, e)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                      title="Remove file"
                    >
                      <Trash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* QR Code and Link Section */}
        <div className="p-6 md:col-span-2 border-t md:border-t-0 md:border-l border-gray-200">
          <h2 className="text-xl font-semibold mb-4">QR Code & Shareable Link</h2>
          
          {!selectedFile ? (
            <div className="text-center py-12 text-gray-500">
              <p>Upload a file to generate a QR code and shareable link</p>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    {isUploading ? (
                      <div className="h-48 w-48 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      shareableLink && (
                        <QRCodeSVG 
                          id="qr-code"
                          value={shareableLink} 
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      )
                    )}
                  </div>
                  
                  {shareableLink && !isUploading && (
                    <button
                      onClick={downloadQRCode}
                      className="mt-4 flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Download size={16} />
                      <span>Download QR Code</span>
                    </button>
                  )}
                </div>
                
                {/* File Details and Link */}
                <div className="flex-1 w-full">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">File Details</h3>
                    <p className="text-sm text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedFile.type} • {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Shareable Link</h3>
                    {isUploading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>Generating link...</span>
                      </div>
                    ) : (
                      shareableLink && (
                        <div className="relative">
                          <div className="flex">
                            <input
                              ref={linkInputRef}
                              type="text"
                              value={shareableLink}
                              readOnly
                              className="flex-1 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                            <button
                              onClick={copyToClipboard}
                              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                              title="Copy to clipboard"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                          {copied && (
                            <span className="absolute right-0 mt-1 text-xs text-green-600">
                              Copied!
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm text-gray-600">
                      <LinkIcon size={16} className="inline mr-1" />
                      Share this link or QR code to provide access to your file.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Files are stored in your browser's localStorage. 
                      They will persist between sessions but are limited by storage space 
                      and only accessible on this device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
