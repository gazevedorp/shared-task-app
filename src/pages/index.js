import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthStore } from '../store/useAuthStore'

import LogoutButton from '../components/LogoutButton'

export default function Home() {
    const user = useAuthStore((state) => state.user)

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <h1 className="text-3xl font-bold text-white mb-6">
                        Bem-vindo(a), <br /> {user?.user_metadata.full_name}!
                    </h1>
                    <LogoutButton />
                </div>
            </div>
        </ProtectedRoute>
    )
}