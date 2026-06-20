import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — ÉCLAT',
  description: 'How ÉCLAT handles your data and protects your privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center">
              <span className="text-black font-bold text-sm">É</span>
            </div>
            <span className="font-semibold text-gray-900">ÉCLAT</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              When you sign up for ÉCLAT, we collect your email address and password (hashed, never stored in plain text) for authentication purposes. When you use our Upload Guidance feature, we store the video metadata you enter (length, audio type, topic name, caption text) and the computed results (HookScore, checklist results, generated caption).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What We Do NOT Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>We never ask for or store your actual video files.</strong> ÉCLAT works entirely on the metadata you type in — video length, audio type, caption text, etc. Your videos stay on your phone or computer. We do not access your Instagram, YouTube, or any social media account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Trend Data</h2>
            <p className="text-gray-600 leading-relaxed">
              We fetch publicly available trending video data from the YouTube Data API to show you what&apos;s trending. This data is the same for all users and does not contain any personal information. We store video titles, thumbnails, channel names, and view counts — all of which are publicly available on YouTube.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Data Storage</h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is stored securely in Supabase (built on PostgreSQL) with Row Level Security (RLS) enabled. This means every user can only see and modify their own data — no one else can access your posts, scores, or captions. Our database is hosted on Supabase&apos;s infrastructure with encryption at rest and in transit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Data Deletion</h2>
            <p className="text-gray-600 leading-relaxed">
              You can delete your account at any time by contacting us. When your account is deleted, all your data (creator profile, posts, scores, captions) is permanently removed from our database. Trend data is shared and not tied to any user account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
              <li><strong>Supabase</strong> — authentication and database</li>
              <li><strong>Vercel</strong> — hosting and serverless functions</li>
              <li><strong>YouTube Data API</strong> — fetching publicly available trend data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this privacy policy or your data, contact us at{' '}
              <a href="mailto:hello@eclat.app" className="text-lime-600 hover:text-lime-700">hello@eclat.app</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
