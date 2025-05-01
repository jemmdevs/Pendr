import Header from './components/Header';
import Link from 'next/link';
import { FileText, Edit, Pencil, Type } from 'lucide-react';

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
            Your all-in-one writing toolbox for creating, editing, and formatting text with ease.
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
            Your <span className="text-[#FF8C42]">Perfect</span> Writing Tools
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
            
            {/* Coming Soon - Module 1 */}
            <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#3B82F6] text-white text-xs font-bold px-3 py-1 rounded-full">
                Coming Soon
              </div>
              <div className="bg-[#93C5FD] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                <Pencil size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">
                Note Taking
              </h3>
              <p className="text-gray-600 flex-grow">
                Organize your thoughts with our intuitive note-taking system.
              </p>
            </div>
            
            {/* Coming Soon - Module 2 */}
            <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#3B82F6] text-white text-xs font-bold px-3 py-1 rounded-full">
                Coming Soon
              </div>
              <div className="bg-[#93C5FD] p-4 rounded-xl w-16 h-16 flex items-center justify-center text-white mb-6">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#2D3748] mb-3">
                Document Templates
              </h3>
              <p className="text-gray-600 flex-grow">
                Professional templates for all your writing needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#FFF0E5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#2D3748] mb-6">
            Ready to Enhance Your Writing?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start using our text editor today and experience the difference.
          </p>
          <Link 
            href="/text-editor" 
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-md font-medium transition-colors shadow-sm inline-block"
          >
            Try Text Editor
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-8 border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#FF8C42] font-bold text-xl mb-4 md:mb-0">
            Pendr
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Pendr. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
