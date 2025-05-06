'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import { Github, Globe, Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function Footer() {
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: false,
    message: ''
  });
  
  const formRef = useRef();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormStatus({
      submitting: true,
      submitted: false,
      error: false,
      message: ''
    });
    
    try {
      await emailjs.sendForm(
        'service_hvv3j49', 
        'template_j1kla6h',
        formRef.current, 
        'FuCu7_imRFeOqLkhB'
      );
      
      setFormStatus({
        submitting: false,
        submitted: true,
        error: false,
        message: 'Your message has been sent successfully!'
      });
      
      // Reset form
      formRef.current.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({
          ...prev,
          submitted: false,
          message: ''
        }));
      }, 5000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      
      setFormStatus({
        submitting: false,
        submitted: false,
        error: true,
        message: 'There was an error sending your message. Please try again.'
      });
    }
  };
  
  return (
    <footer className="bg-[#2D3748] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Pendr</h3>
            <p className="text-gray-300 mb-6">
              Pendr is your all-in-one toolbox for writing, note-taking, and utility tools.
              Designed to enhance your productivity and simplify your digital tasks.
            </p>
            <div className="flex space-x-4">
              <div className="flex flex-col items-center">
                <Link 
                  href="https://github.com/jemmdevs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#24292E] p-2 rounded-full hover:bg-opacity-80 transition-all mb-1"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </Link>
                <span className="text-xs text-gray-300">My Socials</span>
              </div>
              <div className="flex flex-col items-center">
                <Link 
                  href="https://portfolio-jemmdevs.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#FF8C42] p-2 rounded-full hover:bg-opacity-80 transition-all mb-1"
                  aria-label="Portfolio"
                >
                  <Globe size={20} />
                </Link>
                <span className="text-xs text-gray-300">About Me</span>
              </div>
              <div className="flex flex-col items-center">
                <Link 
                  href="https://jemmdevs.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#3B82F6] p-2 rounded-full hover:bg-opacity-80 transition-all mb-1"
                  aria-label="Personal Blog"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                </Link>
                <span className="text-xs text-gray-300">My Personal Blog</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/text-editor" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Text Editor
                </Link>
              </li>
              <li>
                <Link href="/note-taking" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Note Taking
                </Link>
              </li>
              <li>
                <Link href="/invoice-generator" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/qr-generator" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  QR Generator
                </Link>
              </li>
              <li>
                <Link href="/xml-converter" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  XML Converter
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Me</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  required
                  className="w-full px-4 py-2 bg-[#1A202C] border border-[#4A5568] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-white"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  required
                  className="w-full px-4 py-2 bg-[#1A202C] border border-[#4A5568] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-white"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  className="w-full px-4 py-2 bg-[#1A202C] border border-[#4A5568] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8C42] text-white resize-none"
                  placeholder="Your message"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={formStatus.submitting}
                className="w-full bg-[#FF8C42] hover:bg-[#E67539] text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formStatus.submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
              
              {formStatus.submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center" role="alert">
                  <Check size={18} className="mr-2" />
                  <span>{formStatus.message}</span>
                </div>
              )}
              
              {formStatus.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
                  <AlertCircle size={18} className="mr-2" />
                  <span>{formStatus.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="border-t border-[#4A5568] mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Pendr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
