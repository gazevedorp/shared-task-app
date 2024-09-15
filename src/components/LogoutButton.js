import { useAuthStore } from '../store/useAuthStore'
import { useRouter } from 'next/router'

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
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
            Sair
        </button>
    )
}
