import { useAuthStore } from '../store/useAuthStore'
import { useRouter } from 'next/router'
import { FiLogOut } from 'react-icons/fi'

export default function LogoutButton() {
  const signOut = useAuthStore((state) => state.signOut)
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-white hover:text-red-500 transition duration-200"
      aria-label="Sair"
    >
      <FiLogOut size={24} />
    </button>
  )
}