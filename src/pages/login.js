import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const setUser = useAuthStore((state) => state.setUser)
  const setError = useAuthStore((state) => state.setError)
  //const error = useAuthStore((state) => state.error)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setError(error.message)
      alert(error.message)
    } else {
      setUser(user)
      router.push('/')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-4 py-8 rounded-lg shadow-md w-full m-6 max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Entrar</h2>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-900 text-white border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-900 text-white border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          Entrar
        </button>
        <button
          type='button'
          onClick={() => router.push('/register')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-2 rounded transition duration-200"
        >
          Criar conta
        </button>
      </form>
    </div>
  )
}
