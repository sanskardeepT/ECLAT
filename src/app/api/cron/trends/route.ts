import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { computeTrendScore, extractKeyword } from '@/lib/trends'

// Use service-level client for cron (bypasses RLS)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: NextRequest) {
  // Verify cron secret in production (skip in development)
  if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 })
  }

  try {
    // Fetch trending videos from YouTube India
    // Using videos.list with chart=mostPopular (costs only 1 quota unit vs 100 for search.list)
    const youtubeUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    youtubeUrl.searchParams.set('part', 'snippet,statistics,contentDetails')
    youtubeUrl.searchParams.set('chart', 'mostPopular')
    youtubeUrl.searchParams.set('regionCode', 'IN')
    youtubeUrl.searchParams.set('maxResults', '50')
    youtubeUrl.searchParams.set('key', apiKey)

    const response = await fetch(youtubeUrl.toString())
    
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: 'YouTube API error', details: errorData }, { status: 500 })
    }

    const data = await response.json()
    const videos = data.items || []

    if (videos.length === 0) {
      return NextResponse.json({ message: 'No videos found' })
    }

    // Find max views and likes for normalization
    const maxViews = Math.max(...videos.map((v: any) => parseInt(v.statistics?.viewCount || '0')))
    const maxLikes = Math.max(...videos.map((v: any) => parseInt(v.statistics?.likeCount || '0')))

    const today = new Date().toISOString().split('T')[0]
    const supabase = getSupabaseAdmin()

    // Process each video
    const trendRows = videos.map((video: any) => {
      const viewCount = parseInt(video.statistics?.viewCount || '0')
      const likeCount = parseInt(video.statistics?.likeCount || '0')
      const publishedAt = video.snippet?.publishedAt || new Date().toISOString()

      return {
        keyword: extractKeyword(video.snippet?.title || ''),
        category: 'general',
        trend_score: computeTrendScore(viewCount, likeCount, publishedAt, maxViews, maxLikes),
        date: today,
        platform: 'youtube',
        video_id: video.id,
        video_title: (video.snippet?.title || '').slice(0, 200),
        thumbnail_url: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || '',
        channel_name: video.snippet?.channelTitle || '',
        view_count: viewCount,
        like_count: likeCount,
      }
    })

    // Delete old trends (older than 14 days)
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    await supabase
      .from('trends')
      .delete()
      .lt('date', fourteenDaysAgo.toISOString().split('T')[0])

    // Upsert trends (dedup by video_id + date)
    const { error: upsertError } = await supabase
      .from('trends')
      .upsert(trendRows, {
        onConflict: 'video_id,date',
        ignoreDuplicates: false,
      })

    if (upsertError) {
      return NextResponse.json({ error: 'Database error', details: upsertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${trendRows.length} trending videos`,
      date: today,
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', details: err.message }, { status: 500 })
  }
}
