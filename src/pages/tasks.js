import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthStore } from '../store/useAuthStore'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'
import TaskCard from '../components/TaskCard'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import { useRouter } from 'next/router'

export default function Tasks() {
    const user = useAuthStore((state) => state.user)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [newTaskDescription, setNewTaskDescription] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [shareCode, setShareCode] = useState('')
    const [codeExpiry, setCodeExpiry] = useState(null)
    const router = useRouter()

    const handleGenerateShareCode = async () => {
        const code = Math.random().toString(36).substr(2, 8)
        const expiresAt = new Date(Date.now() + 10 * 60000).toISOString()

        const { error } = await supabase.from('task_sharing').insert([
            {
                owner_id: user.id,
                share_code: code,
                expires_at: expiresAt,
            },
        ])

        if (error) {
            console.error('Erro ao gerar código de compartilhamento:', error)
        } else {
            setShareCode(code)
            setCodeExpiry(expiresAt)
        }
    }

    const fetchTasks = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('is_complete', { ascending: true })
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

        const { error } = await supabase.from('tasks').insert([
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
            setIsModalOpen(false)
            fetchTasks()
        }
    }

    const handleBackClick = () => {
        router.push('/')
    }


    useEffect(() => {
        if (user) {
            fetchTasks()
        }
    }, [user])

    // Funções para manipular tarefas
    const handleCompleteTask = async (task) => {
        const { error } = await supabase
            .from('tasks')
            .update({ is_complete: !task.is_complete })
            .eq('id', task.id)
        if (error) {
            console.error(error)
        } else {
            fetchTasks()
        }
    }

    const handleDeleteTask = async (task) => {
        if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', task.id)
            if (error) {
                console.error(error)
            } else {
                fetchTasks()
            }
        }
    }

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editTask, setEditTask] = useState(null)

    const handleEditTask = (task) => {
        setEditTask(task)
        setNewTaskTitle(task.title)
        setNewTaskDescription(task.description || '')
        setIsEditModalOpen(true)
    }

    const handleUpdateTask = async (e) => {
        e.preventDefault()
        if (newTaskTitle.trim() === '') return

        const { error } = await supabase
            .from('tasks')
            .update({
                title: newTaskTitle,
                description: newTaskDescription,
            })
            .eq('id', editTask.id)
        if (error) {
            console.error(error)
        } else {
            setNewTaskTitle('')
            setNewTaskDescription('')
            setEditTask(null)
            setIsEditModalOpen(false)
            fetchTasks()
        }
    }

    return (
        <ProtectedRoute>
            <div className="relative min-h-screen bg-gray-900 p-4">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-white text-center md:text-left">
                            Minhas Tarefas
                        </h1>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                            <button
                                onClick={handleBackClick}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                    {/* Botão Adicionar Tarefa */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mb-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Adicionar Tarefa
                    </button>
                    <button
                        onClick={handleGenerateShareCode}
                        className="mb-6 md:ml-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Gerar Código de Compartilhamento
                    </button>

                    {shareCode && (
                        <div className="mb-6 bg-gray-800 p-4 rounded">
                            <p className="text-white">
                                Compartilhe este código para que alguém possa visualizar suas tarefas:
                            </p>
                            <p className="text-green-500 text-xl font-bold">{shareCode}</p>
                            <p className="text-gray-400">
                                Este código expira em {new Date(codeExpiry).toLocaleTimeString()}.
                            </p>
                            <button
                                onClick={() => navigator.clipboard.writeText(shareCode)}
                                className="mt-2 bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded"
                            >
                                Copiar Código
                            </button>
                        </div>
                    )}
                    {/* Lista de Tarefas */}
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onComplete={handleCompleteTask}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400">Você ainda não tem tarefas.</p>
                    )}
                </div>

                {/* Modais */}
                {/* Modal para Adicionar Tarefa */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-2xl font-bold text-white mb-4">Nova Tarefa</h2>
                    <form onSubmit={handleAddTask}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Título da tarefa"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-gray-700 text-white border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                placeholder="Descrição (opcional)"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 text-white border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                        </div>
                        <div className="flex w-full">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded transition duration-200 mr-1"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition duration-200 ml-1"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Modal para Editar Tarefa */}
                {isEditModalOpen && (
                    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                        <h2 className="text-2xl font-bold text-white mb-4">Editar Tarefa</h2>
                        <form onSubmit={handleUpdateTask}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Título da tarefa"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    placeholder="Descrição (opcional)"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <div className="flex w-full">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false)
                                        setEditTask(null)
                                    }}
                                    className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded transition duration-200 mr-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition duration-200 ml-1"
                                >
                                    Atualizar
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Spinner de Carregamento */}
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <Spinner />
                    </div>
                )}
            </div>
        </ProtectedRoute>
    )
}