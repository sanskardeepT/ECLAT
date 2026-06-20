// ÉCLAT — Trends helper functions

export interface TrendItem {
  id: string
  keyword: string
  category: string
  trend_score: number
  date: string
  platform: string
  video_id: string
  video_title: string
  thumbnail_url: string
  channel_name: string
  view_count: number
  like_count: number
}

export function computeTrendScore(
  viewCount: number,
  likeCount: number,
  publishedAt: string,
  maxViews: number,
  maxLikes: number
): number {
  // Normalize views and likes to 0-1 range
  const normalizedViews = maxViews > 0 ? viewCount / maxViews : 0
  const normalizedLikes = maxLikes > 0 ? likeCount / maxLikes : 0

  // Recency bonus: videos published today get higher score
  const hoursAgo = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60)
  const recencyBonus = Math.max(0, 1 - hoursAgo / 48) // Decays over 48 hours

  // Weighted score
  const score = normalizedViews * 0.4 + normalizedLikes * 0.3 + recencyBonus * 0.3

  // Scale to 0-100
  return Math.round(score * 100)
}

export function extractKeyword(title: string): string {
  // Remove common YouTube title patterns and extract meaningful words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'how', 'make', 'making', 'made', 'best',
    'easy', 'simple', 'quick', 'recipe', 'recipes', 'video', 'vlog',
    'cooking', 'cook', 'home', 'style', 'indian', 'desi', 'this', 'that',
    'is', 'was', 'are', 'were', 'will', 'can', 'do', 'does', 'my', 'your',
    'i', 'me', 'we', 'you', 'it', 'its', 'he', 'she', 'they', 'them',
    '|', '-', '–', '—', '!', '?', '#', '@',
  ])

  const words = title
    .replace(/[^\w\s]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))

  // Return first 3-4 meaningful words as the keyword
  return words.slice(0, 4).join(' ') || title.slice(0, 30)
}

export function formatViewCount(count: number): string {
  if (count >= 10000000) return `${(count / 10000000).toFixed(1)}Cr`
  if (count >= 100000) return `${(count / 100000).toFixed(1)}L`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}
