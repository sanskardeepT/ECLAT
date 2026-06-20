import { createClient } from '@/lib/supabase/server'
import AnalyzeForm from './AnalyzeForm'

export default async function AnalyzePage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Get creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user?.id ?? '')
    .single()

  // Get all posts for this creator to analyze
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('creator_id', creator?.id ?? '')
    .order('created_at', { ascending: false })

  const hasPosts = posts && posts.length > 0

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post Analysis (Spike Decoder)</h1>
        <p className="text-gray-500 text-sm mt-1">
          Paste your actual reel stats and get a performance verdict based on your Engagement Value Score (EVS).
        </p>
      </div>

      {!hasPosts ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts available to analyze</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You must first evaluate a post using the 7-Point Upload Guidance checklist before you can decode its performance here.
          </p>
          <a
            href="/dashboard/upload"
            className="inline-flex items-center justify-center bg-lime-400 hover:bg-lime-500 text-black font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-lime-200/50 active:scale-95 text-sm"
          >
            Checklist Upload Guidance
          </a>
        </div>
      ) : (
        <AnalyzeForm posts={posts} />
      )}
    </div>
  )
}
