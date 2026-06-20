'use client'

import { useState } from 'react'
import { analyzeUpload } from './actions'
import type { ChecklistResult } from '@/lib/checklist'

export default function UploadPage() {
  const [result, setResult] = useState<ChecklistResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [captionLength, setCaptionLength] = useState(0)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await analyzeUpload(formData)
      if (response.error) {
        setError(response.error)
      } else if (response.result) {
        setResult(response.result)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyCaption() {
    if (result?.generatedCaption) {
      navigator.clipboard.writeText(result.generatedCaption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Guidance</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in your video details, get a HookScore, and copy the perfect caption
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Video Details</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            {/* Dish / Topic */}
            <div>
              <label htmlFor="dishTopic" className="block text-sm font-medium text-gray-700 mb-1.5">
                Content Topic *
              </label>
              <input
                id="dishTopic"
                name="dishTopic"
                type="text"
                required
                placeholder="e.g., Tech Review, Makeup Tutorial, Fitness Tips"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
              />
            </div>

            {/* Video Length */}
            <div>
              <label htmlFor="videoLength" className="block text-sm font-medium text-gray-700 mb-1.5">
                Video Length (seconds) *
              </label>
              <input
                id="videoLength"
                name="videoLength"
                type="number"
                required
                min={1}
                max={300}
                placeholder="e.g., 45"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Sweet spot: 30-60 seconds</p>
            </div>

            {/* Audio Type */}
            <div>
              <label htmlFor="audioType" className="block text-sm font-medium text-gray-700 mb-1.5">
                Audio Type
              </label>
              <select
                id="audioType"
                name="audioType"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
              >
                <option value="trending">🔥 Trending Audio</option>
                <option value="original">🎵 Original Audio</option>
                <option value="none">🔇 No Audio</option>
              </select>
            </div>

            {/* Caption */}
            <div>
              <label htmlFor="captionText" className="block text-sm font-medium text-gray-700 mb-1.5">
                Caption Text
              </label>
              <textarea
                id="captionText"
                name="captionText"
                rows={3}
                placeholder="Write your caption here..."
                onChange={(e) => setCaptionLength(e.target.value.length)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all resize-none"
              />
              <p className={`text-xs mt-1 ${
                captionLength >= 125 && captionLength <= 200
                  ? 'text-lime-600'
                  : captionLength > 0
                  ? 'text-orange-500'
                  : 'text-gray-400'
              }`}>
                {captionLength}/200 characters {captionLength >= 125 && captionLength <= 200 ? '✓ Perfect length' : '(aim for 125-200)'}
              </p>
            </div>

            {/* Platform */}
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1.5">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
              >
                <option value="instagram">Instagram Reels</option>
                <option value="youtube">YouTube Shorts</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="hasTextOverlay"
                  className="w-4 h-4 rounded border-gray-300 text-lime-500 focus:ring-lime-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Has text overlay on video</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isOriginal"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-lime-500 focus:ring-lime-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Original content (not reposted)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-lime-200/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze My Reel'
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* HookScore */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">HookScore</h2>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    result.grade === 'A' ? 'bg-green-100 text-green-700' :
                    result.grade === 'B' ? 'bg-lime-100 text-lime-700' :
                    result.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                    result.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Grade {result.grade}
                  </span>
                </div>

                {/* Score gauge */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke={result.hookScore >= 70 ? '#a3e635' : result.hookScore >= 40 ? '#facc15' : '#ef4444'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${result.hookScore * 2.51} 251`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{result.hookScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{result.gradeLabel}</p>
                    <p className="text-sm text-gray-500">{result.passedCount}/{result.totalCount} checks passed</p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">7-Point Checklist</h2>
                <div className="space-y-3">
                  {result.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        item.passed
                          ? 'bg-lime-50/50 border-lime-100'
                          : 'bg-red-50/50 border-red-100'
                      }`}
                    >
                      <span className="text-lg mt-0.5">
                        {item.passed ? '✅' : '❌'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <span className="text-xs text-gray-400">{item.weight} pts</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        {!item.passed && (
                          <p className="text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded-lg">
                            💡 {item.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Caption */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Caption Template</h2>
                  <button
                    onClick={copyCaption}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                      copied
                        ? 'bg-lime-100 text-lime-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-lime-100 hover:text-lime-700'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed border border-gray-100">
                  {result.generatedCaption}
                </pre>
              </div>

              {/* Best Posting Times */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Best Posting Times (IST)</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-lime-50 rounded-xl p-4 border border-lime-100">
                    <p className="text-xs text-gray-500 mb-1">Morning</p>
                    <p className="text-sm font-semibold text-gray-900">9:00 - 11:00 AM</p>
                    <p className="text-xs text-lime-600 mt-1">🔥 Peak engagement</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <p className="text-xs text-gray-500 mb-1">Evening</p>
                    <p className="text-sm font-semibold text-gray-900">7:00 - 9:00 PM</p>
                    <p className="text-xs text-orange-600 mt-1">📱 Peak scrolling</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs text-gray-500 mb-1">Weekend</p>
                    <p className="text-sm font-semibold text-gray-900">11:00 AM - 1:00 PM</p>
                    <p className="text-xs text-blue-600 mt-1">🎉 Leisure time</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs text-gray-500 mb-1">Avoid</p>
                    <p className="text-sm font-semibold text-gray-900">2:00 - 5:00 AM</p>
                    <p className="text-xs text-purple-600 mt-1">😴 Low activity</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-lime-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to analyze</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Fill in your video details on the left and hit &quot;Analyze My Reel&quot; to get your HookScore, checklist, and caption.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
