import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo a la izquierda */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-[#FF8C42] hover:text-[#E67539] transition-colors">
            Pendr
          </Link>
          
          {/* Menú de navegación */}
          <nav className="ml-8">
            <ul className="flex space-x-6">
              <li>
                <Link href="/text-editor" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Text Editor
                </Link>
              </li>
              <li>
                <Link href="/note-taking" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/base64-tool" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Base64 Tool
                </Link>
              </li>
              <li>
                <Link href="/bill-split" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Bill Split
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href="/password-checker" className="text-gray-600 hover:text-[#FF8C42] transition-colors">
                  Password Checker
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Botones de autenticación a la derecha */}
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-md hover:bg-[#2563EB] transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}