export default function TaskCard({ task, onToggleComplete }) {
    return (
      <div
        className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 cursor-pointer"
        onClick={() => onToggleComplete(task)}
      >
        <div className="flex justify-between items-center">
          <h3
            className={`text-xl font-semibold ${
              task.is_complete ? 'text-gray-500 line-through' : 'text-white'
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`${
              task.is_complete ? 'text-green-500' : 'text-yellow-500'
            } font-semibold`}
          >
            {task.is_complete ? 'Concluída' : 'Pendente'}
          </span>
        </div>
        {task.description && (
          <p
            className={`mt-2 ${
              task.is_complete ? 'text-gray-500 line-through' : 'text-gray-300'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
    )
  }
