import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime-50/50 via-white to-white" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-lime-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-100/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-700 font-medium">Free for all creators</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
          Your short-form content,
          <br />
          <span className="text-lime-500">optimized to go viral</span>
        </h1>

        {/* Value prop */}
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-100">
          ÉCLAT scores your content before you post, shows you what&apos;s trending in your niche, and gives you the perfect caption — all in one dashboard.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up delay-200">
          <Link
            href="/auth"
            className="bg-lime-400 hover:bg-lime-500 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all hover:shadow-xl hover:shadow-lime-200/50 active:scale-95 hover:-translate-y-0.5"
          >
            Start Free →
          </Link>
          <a
            href="#features"
            className="text-gray-500 hover:text-gray-700 font-medium px-6 py-4 transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 animate-fade-in-up delay-300">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free forever
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Instant setup
          </span>
        </div>
      </div>
    </section>
  )
}
