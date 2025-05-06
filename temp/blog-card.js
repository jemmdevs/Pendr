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
