'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="text-black font-bold text-sm">É</span>
          </div>
          <span className="font-semibold text-lg text-gray-900 tracking-tight">ÉCLAT</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium bg-lime-400 hover:bg-lime-500 text-black px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-lime-200 active:scale-95"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-6 py-4 flex flex-col gap-3">
            <a href="#features" onClick={() => setIsMobileOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 py-2">Features</a>
            <a href="#pricing" onClick={() => setIsMobileOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 py-2">Pricing</a>
            <a href="#faq" onClick={() => setIsMobileOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 py-2">FAQ</a>
            <hr className="border-gray-100" />
            <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900 py-2">Login</Link>
            <Link
              href="/auth"
              className="text-sm font-medium bg-lime-400 hover:bg-lime-500 text-black px-5 py-2.5 rounded-full text-center transition-all"
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
