import { createClient } from '@/lib/supabase/server'
import { formatViewCount } from '@/lib/trends'

export default async function TrendsPage() {
  const supabase = await createClient()

  // Get trends from last 7 days, sorted by score
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: trends, error } = await supabase
    .from('trends')
    .select('*')
    .gte('date', sevenDaysAgo.toISOString().split('T')[0])
    .order('trend_score', { ascending: false })
    .limit(50)

  const today = new Date().toISOString().split('T')[0]
  const todayTrends = trends?.filter(t => t.date === today) || []
  const olderTrends = trends?.filter(t => t.date !== today) || []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trending Content Topics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Updated daily from YouTube India
        </p>
      </div>

      {(!trends || trends.length === 0) ? (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trends yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Trends update daily at 10:30 AM IST. Check back soon to see what&apos;s hot right now!
          </p>
          <p className="text-xs text-gray-400 mt-4">
            If you&apos;re the admin, you can trigger a manual fetch at <code className="bg-gray-100 px-1.5 py-0.5 rounded">/api/cron/trends</code>
          </p>
        </div>
      ) : (
        <>
          {/* Today's Trends */}
          {todayTrends.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Trends</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{todayTrends.length} topics</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayTrends.map((trend) => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </div>
          )}

          {/* Older Trends */}
          {olderTrends.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Past 7 Days</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {olderTrends.map((trend) => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function TrendCard({ trend }: { trend: any }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${trend.video_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-lime-200 transition-all"
    >
      {/* Thumbnail */}
      {trend.thumbnail_url && (
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <img
            src={trend.thumbnail_url}
            alt={trend.keyword}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
            Score: {trend.trend_score}
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Keyword */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-lime-600 transition-colors">
          {trend.keyword}
        </h3>

        {/* Video title */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {trend.video_title}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-500">{formatViewCount(trend.view_count)}</span>
          </div>
          <span className="text-xs text-gray-400">{trend.channel_name}</span>
        </div>

        {/* Trend score bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-lime-400 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(trend.trend_score, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </a>
  )
}
