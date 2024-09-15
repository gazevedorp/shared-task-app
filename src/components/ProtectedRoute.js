import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthStore } from '../store/useAuthStore'

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const fetchUser = useAuthStore((state) => state.fetchUser)
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      fetchUser()
    }
    if (!user && !loading) {
      router.push('/login')
    }
  }, [user, loading])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}