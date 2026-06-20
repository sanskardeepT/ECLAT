const testimonials = [
  {
    name: 'Priya Sharma',
    handle: '@priyacreates',
    avatar: '✨',
    text: 'My reels went from 500 views to 15K average after using ÉCLAT\'s checklist for just 2 weeks. The caption templates alone are worth it.',
    metric: '30x more views',
  },
  {
    name: 'Rohit Mehra',
    handle: '@rohitfilms',
    avatar: '🎬',
    text: 'I used to spend 20 minutes writing captions. Now ÉCLAT generates them in seconds, and they perform better than my manual ones.',
    metric: '20 min saved/post',
  },
  {
    name: 'Ananya Iyer',
    handle: '@ananyavibes',
    avatar: '🚀',
    text: 'The trend tracker showed me a topic was trending before anyone else noticed. I posted and got my first 100K reel!',
    metric: '100K viral reel',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-lime-600 uppercase tracking-wider">Loved by Creators</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Creators are seeing real results
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Don&apos;t take our word for it — here&apos;s what creators are saying.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow duration-300"
            >
              {/* Metric badge */}
              <div className="inline-block bg-lime-50 text-lime-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {testimonial.metric}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{testimonial.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
