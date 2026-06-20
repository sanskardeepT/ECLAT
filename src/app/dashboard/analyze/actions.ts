'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface UpdateStatsInput {
  postId: string
  views: number
  likes: number
  shares: number
  saves: number
  comments: number
  completionRate: number
}

export async function updatePostStats(input: UpdateStatsInput) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be logged in to update stats' }
  }

  // Get creator profile
  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (creatorError || !creator) {
    return { error: 'Creator profile not found' }
  }

  // Validate post ownership
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', input.postId)
    .eq('creator_id', creator.id)
    .single()

  if (fetchError || !post) {
    return { error: 'Post not found or unauthorized' }
  }

  // Calculate EVS (Engagement Value Score)
  // EVS = ((likes * 1 + comments * 2 + shares * 4 + saves * 5) / views) * 100
  const totalEngagementPoints =
    input.likes * 1 +
    input.comments * 2 +
    input.shares * 4 +
    input.saves * 5

  const evsScore = input.views > 0 ? (totalEngagementPoints / input.views) * 100 : 0
  const roundedEvs = Math.round(evsScore * 100) / 100 // Round to 2 decimal places

  // Update post stats in Supabase
  const { data: updatedPost, error: updateError } = await supabase
    .from('posts')
    .update({
      views: input.views,
      likes: input.likes,
      shares: input.shares,
      saves: input.saves,
      comments: input.comments,
      completion_rate: input.completionRate,
      evs_score: roundedEvs,
      upload_time: new Date().toISOString(),
    })
    .eq('id', input.postId)
    .select()
    .single()

  if (updateError) {
    return { error: `Failed to update post: ${updateError.message}` }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/analyze')
  revalidatePath('/dashboard/diary')

  return {
    success: true,
    post: updatedPost,
  }
}
