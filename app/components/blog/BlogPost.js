'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Calendar, User, ArrowLeft, Share2, Copy } from 'lucide-react';

export default function BlogPost({ post }) {
  const [copied, setCopied] = useState(false);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Copy current URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-[#FF8C42] transition-colors mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to all posts
        </Link>
        
        <h1 className="text-3xl font-bold text-[#2D3748] mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <div className="flex items-center mr-4">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(post.date)}</span>
            </div>
            
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              <span>{post.author}</span>
            </div>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
          >
            {copied ? (
              <>
                <Copy size={14} className="mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={14} className="mr-1" />
                Share
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Post content */}
      <div className="p-6">
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* Post footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-[#FF8C42] transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to all posts
          </Link>
          
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center px-4 py-2 bg-[#FF8C42] hover:bg-[#E67539] rounded-md text-white transition-colors"
          >
            {copied ? (
              <>
                <Copy size={16} className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={16} className="mr-2" />
                Share this post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
