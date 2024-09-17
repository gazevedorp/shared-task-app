import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthStore } from '../store/useAuthStore'
import LogoutButton from '../components/LogoutButton'
import { useRouter } from 'next/router'

export default function Home() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  const handleTasksClick = () => {
    router.push('/tasks')
  }

  const handleSharedTasksClick = () => {
    router.push('/shared-tasks');
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gray-900 p-4 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col items-center mt-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Bem-vindo(a),
              <span className="block md:inline"> {user?.user_metadata.full_name}!</span>
            </h1>
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={handleTasksClick}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Minhas tarefas
            </button>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSharedTasksClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 w-64"
            >
              Tarefas Compartilhadas
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute >
  )
}