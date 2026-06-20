import { createClient } from '@/lib/supabase/server'

export default async function DiaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user?.id ?? '')
    .single()

  // Get all posts for this creator
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('creator_id', creator?.id ?? '')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Diary</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track every post you analyze — spot patterns over time
        </p>
      </div>

      {(!posts || posts.length === 0) ? (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Go to <a href="/dashboard/upload" className="text-lime-600 hover:text-lime-700 font-medium">Upload Guidance</a> to analyze your first video — it&apos;ll show up here automatically.
          </p>
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{posts.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Avg HookScore</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(posts.reduce((sum, p) => sum + (p.hook_score || 0), 0) / posts.length)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Best Score</p>
              <p className="text-2xl font-bold text-lime-600 mt-1">
                {Math.max(...posts.map(p => p.hook_score || 0))}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Top Topic</p>
              <p className="text-lg font-bold text-gray-900 mt-1 truncate">
                {findTopTopic(posts)}
              </p>
            </div>
          </div>

          {/* Posts table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Topic</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">HookScore</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Platform</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Length</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{post.dish_topic || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                post.hook_score >= 70 ? 'bg-lime-400' :
                                post.hook_score >= 40 ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}
                              style={{ width: `${post.hook_score}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${
                            post.hook_score >= 70 ? 'text-lime-600' :
                            post.hook_score >= 40 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {post.hook_score}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                          {post.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {post.video_length}s
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                        {post.audio_type === 'trending' ? '🔥 Trending' :
                         post.audio_type === 'original' ? '🎵 Original' : '🔇 None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function findTopTopic(posts: any[]): string {
  const topics: Record<string, number> = {}
  posts.forEach(p => {
    const topic = p.dish_topic || 'Unknown'
    topics[topic] = (topics[topic] || 0) + 1
  })
  const sorted = Object.entries(topics).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || '—'
}
