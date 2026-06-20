import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started',
    cta: 'Start Free',
    highlighted: false,
    features: [
      'Upload Guidance with HookScore',
      '7-point checklist analysis',
      'Auto-generated captions',
      'Daily trend updates',
      'Content diary (unlimited posts)',
      'Best posting time suggestions',
    ],
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    description: 'For serious creators',
    cta: 'Coming Soon',
    highlighted: true,
    features: [
      'Everything in Free',
      'Spike Decoder (post analysis)',
      'Advanced trend predictions',
      'Copyright safety scanner',
      'Priority support',
      'Export reports as PDF',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-lime-600 uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Start free, upgrade when you&apos;re ready
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            No surprises, no hidden fees. The free plan is genuinely free — forever.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border transition-shadow duration-300 ${
                plan.highlighted
                  ? 'border-lime-300 bg-white shadow-xl shadow-lime-100/50'
                  : 'border-gray-200 bg-white hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                  Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>

              <Link
                href={plan.highlighted ? '#' : '/auth'}
                className={`block text-center py-3 rounded-full font-medium text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-lime-400 hover:bg-lime-500 text-black hover:shadow-lg hover:shadow-lime-200/50 active:scale-95'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-lime-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
