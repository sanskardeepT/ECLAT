import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — ÉCLAT',
  description: 'Terms and conditions for using ÉCLAT.',
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By creating an account or using ÉCLAT, you agree to these Terms of Service. If you don&apos;t agree, please don&apos;t use the service. We may update these terms from time to time — continued use after changes means you accept the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What ÉCLAT Is</h2>
            <p className="text-gray-600 leading-relaxed">
              ÉCLAT is a free web tool that helps content creators optimize their social media reels. It provides a scoring checklist, caption templates, and trending topic data. ÉCLAT does not guarantee any specific results in terms of views, followers, or engagement — we provide tools and guidance based on general best practices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Account</h2>
            <p className="text-gray-600 leading-relaxed">
              You&apos;re responsible for keeping your account credentials secure. Don&apos;t share your password. You must be at least 13 years old to create an account. One person, one account — don&apos;t create multiple accounts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Content</h2>
            <p className="text-gray-600 leading-relaxed">
              You own the content you create using ÉCLAT (captions, scores, etc.). We don&apos;t claim any ownership over your content. However, by using the service, you grant us a limited license to store and process the metadata you enter for the purpose of providing the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed">
              Don&apos;t use ÉCLAT to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
              <li>Violate any laws or regulations</li>
              <li>Abuse, harass, or harm other users</li>
              <li>Attempt to access other users&apos; data</li>
              <li>Overload the service with automated requests</li>
              <li>Reverse-engineer or copy the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              ÉCLAT is provided &quot;as is&quot; without warranties of any kind. We&apos;re not liable for any damages arising from your use of the service, including but not limited to loss of data, revenue, or business opportunities. Our total liability is limited to the amount you&apos;ve paid us (which, on the free tier, is ₹0).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about these terms? Email us at{' '}
              <a href="mailto:hello@eclat.app" className="text-lime-600 hover:text-lime-700">hello@eclat.app</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
