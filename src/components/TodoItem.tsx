import React from 'react';

interface TodoItemProps {
  todo: any;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div
        className={`cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
        onClick={() => onToggle(todo._id, !todo.completed)}
      >
        {todo.text}
      </div>
      <button
        onClick={() => onDelete(todo._id)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
