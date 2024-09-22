// pages/shared-tasks.js

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Ajuste o caminho conforme necessário
import TaskCard from '../components/TaskCard'; // Certifique-se de que este componente existe
import ProtectedRoute from '../components/ProtectedRoute'; // Se necessário
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'

export default function SharedTasks() {
  const router = useRouter()
  const [shareCode, setShareCode] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ownerFirstName, setOwnerFirstName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);
  const [tasksByUser, setTasksByUser] = useState({});
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    fetchSharedUsers();
  }, []);

  const fetchSharedUsers = async () => {
    const { data, error } = await supabase.rpc('get_users_who_shared_with_me');
    if (error) {
      console.error('Erro ao buscar usuários:', error);
    } else {
      setSharedUsers(data);
    }
  };

  const handleToggle = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      if (!tasksByUser[userId]) {
        setLoadingTasks(true);
        const { data, error } = await supabase.rpc('get_shared_tasks_by_user', { p_owner_id: userId });
        if (error) {
          console.error('Erro ao buscar tarefas:', error);
        } else {
          setTasksByUser((prev) => ({ ...prev, [userId]: data }));
        }
        setLoadingTasks(false);
      }
      setExpandedUserId(userId);
    }
  };

  const handleAccessSharedTasks = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTasks([]);
    setOwnerFirstName('');

    try {
      // Chamar a função RPC para associar o código ao usuário atual
      const { data, error: rpcError } = await supabase.rpc('associate_share_code', {
        p_share_code: shareCode,
      });

      if (rpcError) {
        console.error('Erro ao associar o código de compartilhamento:', rpcError);
        setError('Código de compartilhamento inválido ou expirado.');
        setLoading(false);
        return;
      }

      // Atualize a lista de usuários que compartilharam com você
      fetchSharedUsers();
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Ocorreu um erro ao tentar acessar as tarefas.');
    }

    setLoading(false);
  };

  const handleBackClick = () => {
    router.push('/')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center">
        <div className="flex w-full max-w-2xl items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white md:text-left">
            Tarefas Compartilhadas
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
        <form onSubmit={handleAccessSharedTasks} className="w-full max-w-2xl">
          <input
            type="text"
            placeholder="Insira o Código de Compartilhamento"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            Visualizar
          </button>
        </form>

        {/* Spinner de Carregamento */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Spinner />
          </div>
        )}
        <h1 className="text-3xl font-bold text-white mt-6 mb-6 md:text-left">
          Lista:
        </h1>
        {sharedUsers.map((user) => (
          <div key={user.owner_id} className="mb-4">
            <button
              onClick={() => handleToggle(user.owner_id)}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded"
            >
              Tarefas de {user.full_name}
            </button>
            {expandedUserId === user.owner_id && (
              <div className="mt-2">
                {loadingTasks ? (
                  <p className="text-white">Carregando tarefas...</p>
                ) : (
                  tasksByUser[user.owner_id]?.map((task) => (
                    <TaskCard key={task.id} task={task} readOnly={true} />
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </ProtectedRoute >
  );
}