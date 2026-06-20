'use client'

import { useState } from 'react'
import { updatePostStats } from './actions'

interface Post {
  id: string
  dish_topic: string
  created_at: string
  views: number
  likes: number
  shares: number
  saves: number
  comments: number
  completion_rate: number
  evs_score: number
  hook_score: number
  platform: string
}

export default function AnalyzeForm({ posts }: { posts: Post[] }) {
  const [selectedPostId, setSelectedPostId] = useState<string>('')
  const [views, setViews] = useState<string>('')
  const [likes, setLikes] = useState<string>('')
  const [shares, setShares] = useState<string>('')
  const [saves, setSaves] = useState<string>('')
  const [comments, setComments] = useState<string>('')
  const [completionRate, setCompletionRate] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)

  const handlePostChange = (postId: string) => {
    setSelectedPostId(postId)
    setAnalysisResult(null)
    setSuccess(false)
    setError(null)

    if (!postId) {
      setViews('')
      setLikes('')
      setShares('')
      setSaves('')
      setComments('')
      setCompletionRate('')
      return
    }

    const post = posts.find((p) => p.id === postId)
    if (post) {
      setViews(post.views ? post.views.toString() : '')
      setLikes(post.likes ? post.likes.toString() : '')
      setShares(post.shares ? post.shares.toString() : '')
      setSaves(post.saves ? post.saves.toString() : '')
      setComments(post.comments ? post.comments.toString() : '')
      setCompletionRate(post.completion_rate ? post.completion_rate.toString() : '')

      if (post.views > 0) {
        calculateLocalAnalysis(post)
      }
    }
  }

  const calculateLocalAnalysis = (post: any) => {
    const v = post.views
    const l = post.likes
    const sh = post.shares
    const sa = post.saves
    const c = post.comments
    const cr = post.completion_rate
    const evs = post.evs_score

    const saveRate = v > 0 ? (sa / v) * 100 : 0
    const shareRate = v > 0 ? (sh / v) * 100 : 0
    const likeRate = v > 0 ? (l / v) * 100 : 0
    const commentLikeRatio = l > 0 ? (c / l) * 100 : 0

    let verdict = ''
    let verdictDesc = ''
    if (evs >= 8.0) {
      verdict = 'Viral Spike 🔥'
      verdictDesc = 'This video performed in the top tier! Analyze the editing style, sound selection, and topic, and replicate it immediately.'
    } else if (evs >= 4.0) {
      verdict = 'Strong Performance 📈'
      verdictDesc = "Solid evergreen content. It's building high value. Keep this style in your rotation."
    } else if (evs >= 2.0) {
      verdict = 'Healthy Average 👍'
      verdictDesc = 'Standard engagement. Good consistency. Minor improvements in editing or hook timing could spike it.'
    } else {
      verdict = 'Low Traction ⚠️'
      verdictDesc = 'Your hook or topic didn\'t resonate well with the audience. Check your HookScore card next time.'
    }

    setAnalysisResult({
      evs,
      saveRate,
      shareRate,
      likeRate,
      commentLikeRatio,
      verdict,
      verdictDesc,
      completionRate: cr,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPostId) {
      setError('Please select a post to analyze')
      return
    }

    const vNum = parseInt(views) || 0
    const lNum = parseInt(likes) || 0
    const shNum = parseInt(shares) || 0
    const saNum = parseInt(saves) || 0
    const cNum = parseInt(comments) || 0
    const crNum = parseFloat(completionRate) || 0

    if (vNum <= 0) {
      setError('Views must be greater than 0')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await updatePostStats({
        postId: selectedPostId,
        views: vNum,
        likes: lNum,
        shares: shNum,
        saves: saNum,
        comments: cNum,
        completionRate: crNum,
      })

      if (res.error) {
        setError(res.error)
      } else if (res.post) {
        setSuccess(true)
        calculateLocalAnalysis(res.post)
      }
    } catch {
      setError('Failed to update stats. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Enter Post Performance</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-lime-50 text-lime-700 text-sm px-4 py-3 rounded-xl mb-6 border border-lime-100">
            ✓ Post stats analyzed and updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Post Selector */}
          <div>
            <label htmlFor="postId" className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Scored Topic *
            </label>
            <select
              id="postId"
              value={selectedPostId}
              onChange={(e) => handlePostChange(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
            >
              <option value="">-- Choose a post --</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.dish_topic || 'Untitled'} ({new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}) - Score: {post.hook_score}
                </option>
              ))}
            </select>
          </div>

          {selectedPostId && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* Views */}
                <div>
                  <label htmlFor="views" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Views *
                  </label>
                  <input
                    id="views"
                    type="number"
                    required
                    min={0}
                    placeholder="e.g., 5000"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                  />
                </div>

                {/* Likes */}
                <div>
                  <label htmlFor="likes" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Likes
                  </label>
                  <input
                    id="likes"
                    type="number"
                    min={0}
                    placeholder="e.g., 400"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Shares */}
                <div>
                  <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Shares
                  </label>
                  <input
                    id="shares"
                    type="number"
                    min={0}
                    placeholder="e.g., 80"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                  />
                </div>

                {/* Saves */}
                <div>
                  <label htmlFor="saves" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Saves
                  </label>
                  <input
                    id="saves"
                    type="number"
                    min={0}
                    placeholder="e.g., 120"
                    value={saves}
                    onChange={(e) => setSaves(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Comments */}
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Comments
                  </label>
                  <input
                    id="comments"
                    type="number"
                    min={0}
                    placeholder="e.g., 25"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                  />
                </div>

                {/* Completion Rate */}
                <div>
                  <label htmlFor="completionRate" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Completion Rate (%)
                  </label>
                  <input
                    id="completionRate"
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    placeholder="e.g., 52.4"
                    value={completionRate}
                    onChange={(e) => setCompletionRate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-lime-200/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing Performance...
                  </span>
                ) : (
                  'Analyze Spike'
                )}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Results Card */}
      <div className="space-y-6">
        {analysisResult ? (
          <>
            {/* EVS Score Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Spike Verdict (EVS)</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                  Engagement Value Score
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={analysisResult.evs >= 6.0 ? '#a3e635' : analysisResult.evs >= 3.0 ? '#facc15' : '#ef4444'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(analysisResult.evs * 25.1, 251)} 251`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{analysisResult.evs.toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{analysisResult.verdict}</h3>
                  <p className="text-sm text-gray-500 mt-1">{analysisResult.verdictDesc}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Metrics Analysis</h2>

              {/* Save Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Save Rate</span>
                  <span className="text-gray-500">{analysisResult.saveRate.toFixed(2)}% (Target: &gt;1.5%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${analysisResult.saveRate >= 1.5 ? 'bg-lime-500' : 'bg-orange-400'}`}
                    style={{ width: `${Math.min(analysisResult.saveRate * 40, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {analysisResult.saveRate >= 1.5
                    ? '🎉 Outstanding saveability! Viewers value this enough to bookmark it.'
                    : '💡 Low save rate. Try adding educational values, lists, or a clear "Save this for later!" instruction.'}
                </p>
              </div>

              {/* Share Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Share Rate</span>
                  <span className="text-gray-500">{analysisResult.shareRate.toFixed(2)}% (Target: &gt;1.0%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${analysisResult.shareRate >= 1.0 ? 'bg-lime-500' : 'bg-orange-400'}`}
                    style={{ width: `${Math.min(analysisResult.shareRate * 60, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {analysisResult.shareRate >= 1.0
                    ? '🔥 High shareability! This content sparks conversations.'
                    : '💡 Low share rate. Make your video more relatable, emotional, or community-driven to prompt direct sharing.'}
                </p>
              </div>

              {/* Like Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Like Rate (Core Appeal)</span>
                  <span className="text-gray-500">{analysisResult.likeRate.toFixed(2)}% (Target: &gt;5.0%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${analysisResult.likeRate >= 5.0 ? 'bg-lime-500' : 'bg-orange-400'}`}
                    style={{ width: `${Math.min(analysisResult.likeRate * 12, 100)}%` }}
                  />
                </div>
              </div>

              {/* Completion Rate */}
              {analysisResult.completionRate > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Audience Retention</span>
                    <span className="text-gray-500">{analysisResult.completionRate.toFixed(1)}% (Target: &gt;45.0%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${analysisResult.completionRate >= 45.0 ? 'bg-lime-500' : 'bg-orange-400'}`}
                      style={{ width: `${analysisResult.completionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {analysisResult.completionRate >= 45.0
                      ? '🚀 Great pacing! Most viewers watched till the end.'
                      : '💡 High drop-off rate. Cut out slow pauses and keep the editing quick to keep viewers hooked.'}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-lime-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verdict & Breakdown</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Select a scored post from the dropdown and enter its real metrics on the left to see your calculated EVS and performance verdict.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
