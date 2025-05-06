import { getPostBySlug, getAllPosts } from '../../lib/blog';
import BlogPost from '../../components/blog/BlogPost';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  
  // If post doesn't exist, return 404
  if (!post) {
    notFound();
  }
  
  return (
    <>
      <Header />
      
      {/* Header section with breadcrumb */}
      <div className="bg-gradient-to-b from-white to-[#FFF0E5] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-[#FF8C42] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-[#FF8C42] transition-colors">Developer Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-[#FF8C42] truncate max-w-[200px]">{post.title}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-[#FF8C42] p-3 rounded-lg mr-4 text-white">
                <FileText size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2D3748] truncate max-w-[500px]">
                Blog
              </h1>
            </div>
            
            <Link 
              href="/blog" 
              className="hidden md:inline-flex items-center px-4 py-2 bg-white text-[#FF8C42] rounded-md hover:bg-gray-50 transition-colors border border-[#FF8C42]"
            >
              <ArrowLeft size={16} className="mr-2" />
              All Posts
            </Link>
          </div>
        </div>
      </div>
      
      {/* Blog post container */}
      <div className="bg-white py-8 px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#F9FAFB] rounded-lg border border-[#E2E8F0] shadow-sm p-2 md:p-4">
            <BlogPost post={post} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
