import { Outlet } from 'react-router-dom'
import PreviousConversations from './PreviousConversations'

export default function AppLayout() {
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
      <PreviousConversations />
      <main className="md:pl-[296px]">
        <Outlet />
      </main>
    </>
  )
}

