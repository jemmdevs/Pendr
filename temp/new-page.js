import Header from './components/Header';
import Link from 'next/link';
import { FileText, Edit, Pencil, Type, Code, Receipt, Calculator, Shield, FileCode, Book } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[#FFF0E5] py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-[#2D3748] mb-6">
            Welcome to <span className="text-[#FF8C42]">Pendr</span>
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mb-10">
            Your all-in-one toolbox for writing, note-taking, and utility tools.
          </p>
          <Link 
            href="/text-editor" 
            className="bg-[#FF8C42] hover:bg-[#E67539] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2D3748] mb-12">
            Your <span className="text-[#FF8C42]">Perfect</span> Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Text Editor Module */}
            <Link href="/text-editor" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#FFB285] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <Type size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Advanced Text Editor
                </h3>
                <p className="text-gray-600 flex-grow">
                  A powerful WYSIWYG editor with formatting tools, bionic reading, and more.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Note Taking Module */}
            <Link href="/note-taking" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#93C5FD] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <Pencil size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Note Taking
                </h3>
                <p className="text-gray-600 flex-grow">
                  Organize your thoughts with our intuitive note-taking system.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Base64 Tool Module */}
            <Link href="/base64-tool" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#FFA07A] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <Code size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Base64 Tool
                </h3>
                <p className="text-gray-600 flex-grow">
                  Encode text to reversed Base64 or decode reversed Base64 back to text.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Bill Split Module */}
            <Link href="/bill-split" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#93C5FD] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <Receipt size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Bill Split
                </h3>
                <p className="text-gray-600 flex-grow">
                  Split expenses among friends and calculate who owes what to whom.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Calculator Module */}
            <Link href="/calculator" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#4ADE80] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <Calculator size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Calculator
                </h3>
                <p className="text-gray-600 flex-grow">
                  Powerful calculator with standard, scientific and unit conversion modes.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Password Checker Module */}
            <Link href="/password-checker" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#A78BFA] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Password Checker
                </h3>
                <p className="text-gray-600 flex-grow">
                  Verify password strength and get recommendations to improve security.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Invoice Generator Module */}
            <Link href="/invoice-generator" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#FF8C42] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Invoice Generator
                </h3>
                <p className="text-gray-600 flex-grow">
                  Create, customize and download professional invoices. Save templates for future use.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* QR Code Generator Module */}
            <Link href="/qr-generator" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#60A5FA] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <rect x="7" y="7" width="3" height="3"></rect>
                    <rect x="14" y="7" width="3" height="3"></rect>
                    <rect x="7" y="14" width="3" height="3"></rect>
                    <rect x="14" y="14" width="3" height="3"></rect>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  QR Code Generator <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Beta</span>
                </h3>
                <p className="text-gray-600 flex-grow">
                  Generate QR codes and links for your files. Share documents, images, and more easily.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* XML Converter Module */}
            <Link href="/xml-converter" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#10B981] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <FileCode size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  XML Converter
                </h3>
                <p className="text-gray-600 flex-grow">
                  Convert XML to JSON, YAML, or HTML. Validate and visualize XML documents easily.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Try it now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Developer Blog Module */}
            <Link href="/blog" className="group">
              <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 hover:shadow-md transition-all h-full flex flex-col">
                <div className="bg-[#8B5CF6] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                  <Book size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#2D3748] group-hover:text-[#FF8C42] transition-colors mb-3">
                  Developer Blog
                </h3>
                <p className="text-gray-600 flex-grow">
                  Stay updated with the latest news, feature announcements, and productivity tips.
                </p>
                <div className="flex items-center mt-6 text-[#3B82F6] font-medium">
                  Read now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#FFF0E5]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#2D3748] mb-6">
            Ready to Explore Our Tools?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start using our tools today and experience the difference.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/text-editor" 
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm inline-block"
            >
              Try Text Editor
            </Link>
            <Link 
              href="/note-taking" 
              className="bg-[#E67E22] hover:bg-[#D35400] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm inline-block"
            >
              Try Notes
            </Link>
            <Link 
              href="/invoice-generator" 
              className="bg-[#FF8C42] hover:bg-[#E67539] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm inline-block"
            >
              Try Invoices
            </Link>
            <Link 
              href="/qr-generator" 
              className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm inline-block"
            >
              Try QR Generator
            </Link>
            <Link 
              href="/xml-converter" 
              className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm inline-block"
            >
              Try XML Converter
            </Link>
            <Link 
              href="/blog" 
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm inline-block"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
