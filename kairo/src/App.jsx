import { useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import { supabase } from '../supabaseConfig'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Rehydrate Redux auth state from Supabase session on every page load/refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(login({ userData: session.user }))
      } else {
        dispatch(logout())
      }
    })

    // Keep Redux in sync whenever Supabase auth state changes (login/logout/token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(login({ userData: session.user }))
      } else {
        dispatch(logout())
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <>
      <Outlet />
    </>
  )
}

export default App
