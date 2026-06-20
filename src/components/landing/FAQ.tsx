'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What is ÉCLAT?',
    answer: 'ÉCLAT is a free tool built for content creators. It scores your reels before you post, tracks trending topics from YouTube, and generates optimized captions — so you can focus on creating, not guessing what the algorithm wants.',
  },
  {
    question: 'Is ÉCLAT really free?',
    answer: 'Yes! The core features — Upload Guidance, Trend Tracker, Content Diary, and caption generation — are 100% free, forever. We\'ll add a paid Pro tier later with advanced features like post analysis and predictions, but the free plan will always exist.',
  },
  {
    question: 'Do I need to upload my actual video?',
    answer: 'No. ÉCLAT doesn\'t require you to upload any video files. You just fill in details about your video (length, audio type, caption, etc.) and we score it. Your video files stay on your device — we never store them.',
  },
  {
    question: 'How does the HookScore work?',
    answer: 'HookScore is a 0-100 score based on 7 factors that matter for reel performance: hook timing, video length, caption length, trending audio, originality, text overlays, and topic tagging. Each factor has a specific weight. You get a letter grade (A-F) and actionable tips for each point.',
  },
  {
    question: 'Where does the trend data come from?',
    answer: 'We fetch trending videos from YouTube India daily using their official API. We compute a TrendScore based on views, likes, and recency — so you see what\'s actually gaining traction, not just what went viral last week.',
  },
  {
    question: 'What niches does ÉCLAT support?',
    answer: 'ÉCLAT works for any content creator making short-form video — whether you\'re into fitness, tech, comedy, education, lifestyle, beauty, or anything else. The checklist and caption engine are niche-agnostic, and trends are pulled from YouTube\'s Howto & Style category (with more categories coming soon).',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-lime-600 uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-500">
            Everything you need to know about ÉCLAT.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-xl overflow-hidden transition-all hover:border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
