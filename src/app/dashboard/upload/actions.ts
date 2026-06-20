'use server'

import { createClient } from '@/lib/supabase/server'
import { runChecklist, type ChecklistInput } from '@/lib/checklist'
import { revalidatePath } from 'next/cache'

export async function analyzeUpload(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'You must be logged in' }
  }

  // Get creator profile
  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('id, username')
    .eq('user_id', user.id)
    .single()

  if (creatorError || !creator) {
    return { error: 'Creator profile not found. Please try logging out and back in.' }
  }

  // Parse form data
  const videoLength = parseInt(formData.get('videoLength') as string) || 0
  const hasTextOverlay = formData.get('hasTextOverlay') === 'on'
  const audioType = (formData.get('audioType') as string) || 'none'
  const isOriginal = formData.get('isOriginal') === 'on'
  const captionText = (formData.get('captionText') as string) || ''
  const dishTopic = (formData.get('dishTopic') as string) || ''
  const platform = (formData.get('platform') as string) || 'instagram'

  // Validate
  if (videoLength <= 0) {
    return { error: 'Video length must be greater than 0' }
  }
  if (!dishTopic.trim()) {
    return { error: 'Please enter a topic name' }
  }

  // Run checklist
  const input: ChecklistInput = {
    videoLength,
    hasTextOverlay,
    audioType: audioType as 'trending' | 'original' | 'none',
    isOriginal,
    captionText,
    dishTopic,
    username: creator.username || user.email?.split('@')[0] || 'creator',
  }

  const result = runChecklist(input)

  // Save to posts table
  const { error: insertError } = await supabase
    .from('posts')
    .insert({
      creator_id: creator.id,
      platform,
      video_length: videoLength,
      has_text_overlay: hasTextOverlay,
      audio_type: audioType,
      is_original: isOriginal,
      caption_text: captionText,
      dish_topic: dishTopic,
      hook_score: result.hookScore,
      checklist_results: result.items,
      generated_caption: result.generatedCaption,
    })

  if (insertError) {
    return { error: `Failed to save: ${insertError.message}` }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/upload')
  revalidatePath('/dashboard/diary')

  return {
    success: true,
    result,
  }
}
