import { FiCheckCircle, FiEdit2, FiTrash2, FiCircle } from 'react-icons/fi'

export default function TaskCard({ task, onComplete, onEdit, onDelete, readOnly }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center">
        <h3
          className={`text-xl font-semibold ${task.is_complete ? 'text-gray-500 line-through' : 'text-white'
            }`}
        >
          {task.title}
        </h3>
        {!readOnly &&
          <div className="flex space-x-4">
            <button
              onClick={() => onComplete(task)}
              className="text-white hover:text-green-500 transition duration-200"
            >
              {task.is_complete ? (
                <FiCheckCircle size={20} />
              ) : (
                <FiCircle size={20} />
              )}
            </button>
            <button
              onClick={() => onEdit(task)}
              className="text-white hover:text-blue-500 transition duration-200"
            >
              <FiEdit2 size={20} />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="text-white hover:text-red-500 transition duration-200"
            >
              <FiTrash2 size={20} />
            </button>
          </div>}
      </div>
      {task.description && (
        <p
          className={`mt-2 ${task.is_complete ? 'text-gray-500 line-through' : 'text-gray-300'
            }`}
        >
          {task.description}
        </p>
      )}
    </div>
  )
}