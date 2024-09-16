import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthStore } from '../store/useAuthStore'
import LogoutButton from '../components/LogoutButton'
import { supabase } from '../lib/supabaseClient'
import { useState, useEffect } from 'react'
import TaskCard from '../components/TaskCard'

export default function Home() {
    const user = useAuthStore((state) => state.user)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [newTaskDescription, setNewTaskDescription] = useState('')

    useEffect(() => {
        if (user) {
            fetchTasks()
        }
    }, [user])

    const fetchTasks = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) {
            console.error(error)
        } else {
            setTasks(data)
        }
        setLoading(false)
    }

    const handleAddTask = async (e) => {
        e.preventDefault()
        if (newTaskTitle.trim() === '') return

        const { data, error } = await supabase.from('tasks').insert([
            {
                user_id: user.id,
                title: newTaskTitle,
                description: newTaskDescription,
            },
        ])
        if (error) {
            console.error(error)
        } else {
            setNewTaskTitle('')
            setNewTaskDescription('')
            setShowForm(false)
            fetchTasks()
        }
    }

    const toggleComplete = async (task) => {
        const { data, error } = await supabase
            .from('tasks')
            .update({ is_complete: !task.is_complete })
            .eq('id', task.id)
        if (error) {
            console.error(error)
        } else {
            fetchTasks()
        }
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
                <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">
                            Bem-vindo, {user?.user_metadata.full_name}!
                        </h1>
                        <LogoutButton />
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="mb-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        {showForm ? 'Cancelar' : 'Adicionar Tarefa'}
                    </button>

                    {showForm && (
                        <form onSubmit={handleAddTask} className="mb-6">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Título da tarefa"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    placeholder="Descrição (opcional)"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                            >
                                Salvar Tarefa
                            </button>
                        </form>
                    )}

                    {loading ? (
                        <p className="text-white">Carregando tarefas...</p>
                    ) : tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onToggleComplete={toggleComplete} />
                        ))
                    ) : (
                        <p className="text-gray-400">Você ainda não tem tarefas.</p>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}