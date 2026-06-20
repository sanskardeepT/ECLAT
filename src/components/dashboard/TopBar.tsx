import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

export default async function TopBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-sm font-medium text-gray-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h2>
        <p className="text-xs text-gray-400">Let&apos;s make your reels shine today</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  )
}
