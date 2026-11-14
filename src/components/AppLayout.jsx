import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import PreviousConversations from './PreviousConversations'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(false)
  }, [location.pathname])

  // Close on Escape and lock body scroll while drawer is open on mobile
  useEffect(() => {
    if (!sidebarOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [sidebarOpen])

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(1100px 560px at 50% -120px, #FF9A57, transparent 70%),
            radial-gradient(640px 420px at 100% 14%, #FFC59B, transparent 70%),
            radial-gradient(640px 420px at 0% 40%, rgba(255,197,155,.7), transparent 70%),
            #FFFAF6
          `,
        }}
      />

      {/* Sticky top bar on mobile/tablet (below lg) */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#F0DCCB]/80 bg-white/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open chat history"
          aria-expanded={sidebarOpen}
          aria-controls="sidebar-drawer"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F0DCCB]/80 bg-white text-[#2B1810] shadow-sm hover:bg-[#FFF4EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b0f] cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <img
          src="/svg/kairo-logo.svg"
          alt="Kairo"
          className="h-6 w-auto"
          draggable={false}
        />
      </header>

      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <PreviousConversations
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:pl-[296px]">
        <Outlet />
      </main>
    </>
  )
}
