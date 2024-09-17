// pages/shared-tasks.js

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Ajuste o caminho conforme necessário
import TaskCard from '../components/TaskCard'; // Certifique-se de que este componente existe
import ProtectedRoute from '../components/ProtectedRoute'; // Se necessário
import { useRouter } from 'next/router'
import Spinner from '../components/Spinner'

export default function SharedTasks() {
  const [shareCode, setShareCode] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter()

  const handleAccessSharedTasks = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTasks([]);

    try {
      // Chamar a função RPC para obter as tarefas compartilhadas
      const { data, error: rpcError } = await supabase.rpc('get_shared_tasks', {
        p_share_code: shareCode,
      });

      if (rpcError) {
        console.error('Erro ao acessar tarefas compartilhadas:', rpcError);
        setError('Código de compartilhamento inválido ou expirado.');
        setLoading(false);
        return;
      }

      if (data.length === 0) {
        setError('Nenhuma tarefa encontrada com este código.');
      } else {
        setTasks(data);
      }
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl mr-6 font-bold text-white text-center md:text-left">
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
        <form onSubmit={handleAccessSharedTasks} className="w-full max-w-md">
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
            Acessar
          </button>
        </form>

        {/* Spinner de Carregamento */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Spinner />
          </div>
        )}

        {tasks.length > 0 && (
          <div className="w-full max-w-2xl mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Tarefas</h2>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} readOnly />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}