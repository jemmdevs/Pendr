'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

export default function BlogList({ posts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
      return;
    }
    
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Search bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Blog posts list */}
      <div className="p-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-2xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>
                
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
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-[#3B82F6] font-medium group">
                  Read more
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
