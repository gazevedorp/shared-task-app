import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchUser: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      set({ error, loading: false })
    } else {
      set({ user: session?.user ?? null, loading: false })
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
