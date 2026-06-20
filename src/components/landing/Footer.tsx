import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center">
                <span className="text-black font-bold text-sm">É</span>
              </div>
              <span className="font-semibold text-lg text-white">ÉCLAT</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              The free toolkit for creators who want their reels to actually reach people.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-sm hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-sm hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2.5">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">Twitter</a></li>
              <li><a href="mailto:hello@eclat.app" className="text-sm hover:text-white transition-colors">Email Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} ÉCLAT. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Made with ✨ for creators in India
          </p>
        </div>
      </div>
    </footer>
  )
}
