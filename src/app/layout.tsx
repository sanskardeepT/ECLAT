import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ÉCLAT — Optimize Your Reels',
  description:
    'ÉCLAT scores your video content before you post, shows trending topics, and generates the perfect caption. Free forever for content creators.',
  keywords: ['creator tools', 'reel optimization', 'instagram reels', 'HookScore', 'trending topics', 'video creation'],
  openGraph: {
    title: 'ÉCLAT — Optimize Your Reels',
    description: 'Score your reels before posting. See what\'s trending. Get the perfect caption.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
