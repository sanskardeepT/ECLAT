// ÉCLAT — 7-Point Upload Checklist Engine
// Deterministic scoring — no AI API needed

export interface ChecklistInput {
  videoLength: number        // seconds
  hasTextOverlay: boolean
  audioType: 'trending' | 'original' | 'none'
  isOriginal: boolean
  captionText: string
  dishTopic: string
  username?: string
}

export interface ChecklistItem {
  id: number
  name: string
  description: string
  passed: boolean
  weight: number
  tip: string
}

export interface ChecklistResult {
  items: ChecklistItem[]
  hookScore: number
  passedCount: number
  totalCount: number
  generatedCaption: string
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  gradeLabel: string
}

const CHECKLIST_RULES = [
  {
    id: 1,
    name: 'Hook Timing',
    description: 'Video grabs attention in first 3 seconds',
    weight: 20,
    tip: 'Start with a close-up of the dish or a bold text overlay in the first 3 seconds',
    check: (input: ChecklistInput) => input.videoLength <= 60 && (input.hasTextOverlay || input.videoLength <= 30),
  },
  {
    id: 2,
    name: 'Video Length',
    description: 'Optimal length between 15-90 seconds',
    weight: 15,
    tip: 'Keep reels between 15-90 seconds for maximum reach. 30-60s is the sweet spot.',
    check: (input: ChecklistInput) => input.videoLength >= 15 && input.videoLength <= 90,
  },
  {
    id: 3,
    name: 'Caption Length',
    description: 'Caption is 125-200 characters (sweet spot for engagement)',
    weight: 10,
    tip: 'Write captions between 125-200 characters. Too short = no context, too long = nobody reads.',
    check: (input: ChecklistInput) => {
      const len = input.captionText.trim().length
      return len >= 125 && len <= 200
    },
  },
  {
    id: 4,
    name: 'Trending Audio',
    description: 'Uses a trending audio track',
    weight: 20,
    tip: 'Check the Reels tab for songs with the ↗ arrow. Trending audio can 3x your reach.',
    check: (input: ChecklistInput) => input.audioType === 'trending',
  },
  {
    id: 5,
    name: 'Original Content',
    description: 'Content is original, not reposted',
    weight: 15,
    tip: 'Instagram deprioritizes reposted content. Always shoot original footage.',
    check: (input: ChecklistInput) => input.isOriginal,
  },
  {
    id: 6,
    name: 'Text Overlay',
    description: 'Has text overlay for silent viewers',
    weight: 10,
    tip: '85% of social videos are watched without sound. Add text overlays!',
    check: (input: ChecklistInput) => input.hasTextOverlay,
  },
  {
    id: 7,
    name: 'Topic Tagged',
    description: 'Dish or topic name is specified',
    weight: 10,
    tip: 'Always tag your dish/topic — it helps the algorithm categorize your content.',
    check: (input: ChecklistInput) => input.dishTopic.trim().length > 0,
  },
]

export function runChecklist(input: ChecklistInput): ChecklistResult {
  const items: ChecklistItem[] = CHECKLIST_RULES.map(rule => ({
    id: rule.id,
    name: rule.name,
    description: rule.description,
    passed: rule.check(input),
    weight: rule.weight,
    tip: rule.tip,
  }))

  const hookScore = items.reduce((score, item) => {
    return score + (item.passed ? item.weight : 0)
  }, 0)

  const passedCount = items.filter(i => i.passed).length

  const grade = getGrade(hookScore)
  const gradeLabel = getGradeLabel(grade)

  const generatedCaption = generateCaption(input, hookScore, items)

  return {
    items,
    hookScore,
    passedCount,
    totalCount: 7,
    generatedCaption,
    grade,
    gradeLabel,
  }
}

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

function getGradeLabel(grade: string): string {
  switch (grade) {
    case 'A': return 'Viral-Ready 🔥'
    case 'B': return 'Strong Post 💪'
    case 'C': return 'Needs Work 🛠️'
    case 'D': return 'Below Average ⚠️'
    case 'F': return 'Major Fixes Needed 🚨'
    default: return ''
  }
}

function generateCaption(input: ChecklistInput, score: number, items: ChecklistItem[]): string {
  const topic = input.dishTopic.trim() || 'Recipe'
  const username = input.username || 'eclat_creator'
  
  // Hook line based on score
  let hookLine: string
  if (score >= 85) {
    hookLine = `This ${topic} is about to break the internet 🤯`
  } else if (score >= 70) {
    hookLine = `Wait till you see this ${topic} come together ✨`
  } else if (score >= 55) {
    hookLine = `Making ${topic} has never been this easy 👨‍🍳`
  } else {
    hookLine = `Here's my take on ${topic} — tell me what you think! 🍽️`
  }

  // Value lines from passed checks
  const valueLines: string[] = []
  if (items.find(i => i.id === 5)?.passed) {
    valueLines.push('100% original recipe, no shortcuts')
  }
  if (items.find(i => i.id === 2)?.passed) {
    valueLines.push('Quick, easy, and under 90 seconds')
  }
  if (items.find(i => i.id === 4)?.passed) {
    valueLines.push('Paired with the trending audio everyone loves')
  }
  if (valueLines.length === 0) {
    valueLines.push('Simple ingredients, amazing results')
  }

  // Build hashtags
  const topicTag = topic.toLowerCase().replace(/[^a-z0-9]/g, '')
  const hashtags = [
    topicTag ? `#${topicTag}` : '',
    '#cooking',
    '#reels',
    '#eclat',
    '#trending',
    '#foodie',
    '#homecooking',
    '#recipe',
  ].filter(Boolean).join(' ')

  return `🍳 ${topic} — ${hookLine}

${valueLines.map(l => `✅ ${l}`).join('\n')}

👉 Save this for later!
📌 Follow @${username} for more

${hashtags}`
}
