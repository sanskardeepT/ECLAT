import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  // Get latest post
  const { data: latestPost } = await supabase
    .from('posts')
    .select('*')
    .eq('creator_id', creator?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get total posts count
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator?.id ?? '')

  // Get today's trending topics count
  const today = new Date().toISOString().split('T')[0]
  const { count: trendsCount } = await supabase
    .from('trends')
    .select('*', { count: 'exact', head: true })
    .eq('date', today)

  const avgHookScore = latestPost?.hook_score ?? 0

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here&apos;s how your content is doing
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HookScore Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Latest HookScore</p>
              <p className="text-2xl font-bold text-gray-900">{avgHookScore}<span className="text-sm text-gray-400 font-normal">/100</span></p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-lime-400 h-2 rounded-full transition-all"
              style={{ width: `${avgHookScore}%` }}
            />
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Trending Today</p>
              <p className="text-2xl font-bold text-gray-900">{trendsCount ?? 0}<span className="text-sm text-gray-400 font-normal"> topics</span></p>
            </div>
          </div>
          <Link href="/dashboard/trends" className="text-xs text-lime-600 hover:text-lime-700 font-medium">
            View trends →
          </Link>
        </div>

        {/* Posts Analyzed */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Posts Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">{postsCount ?? 0}</p>
            </div>
          </div>
          <Link href="/dashboard/diary" className="text-xs text-lime-600 hover:text-lime-700 font-medium">
            View diary →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/upload"
            className="group p-6 bg-lime-50 border border-lime-200 rounded-2xl hover:bg-lime-100 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-lime-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analyze a New Reel</h3>
                <p className="text-sm text-gray-500">Get your HookScore before posting</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/trends"
            className="group p-6 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Check Today&apos;s Trends</h3>
                <p className="text-sm text-gray-500">See what&apos;s hot in your niche</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Last Post Summary */}
      {latestPost && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Last Post</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{latestPost.dish_topic || 'Untitled'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(latestPost.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                latestPost.hook_score >= 85 ? 'bg-green-100 text-green-700' :
                latestPost.hook_score >= 70 ? 'bg-lime-100 text-lime-700' :
                latestPost.hook_score >= 55 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                HookScore: {latestPost.hook_score}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
