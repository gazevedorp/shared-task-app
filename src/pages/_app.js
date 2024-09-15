import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../lib/supabaseClient'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setError = useAuthStore((state) => state.setError)
  const fetchUser = useAuthStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp