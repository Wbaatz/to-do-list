"use client"
import { useEffect, useState } from 'react';
import TodoItem from '@/components/TodoItem';
import axios from 'axios';

type Todo = {
  _id: string;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get('/api/todos');
    setTodos(res.data.data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await axios.post('/api/todos', { text: newTodo });
    setNewTodo('');
    fetchTodos();
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await axios.put('/api/todos', { id, completed });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await axios.delete('/api/todos', { data: { id } });
    fetchTodos();
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New Todo"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        <button onClick={() => setFilter('all')} className="px-2 py-1 border rounded">
          All
        </button>
        <button onClick={() => setFilter('completed')} className="px-2 py-1 border rounded">
          Completed
        </button>
        <button onClick={() => setFilter('incomplete')} className="px-2 py-1 border rounded">
          Incomplete
        </button>
      </div>

      <div className="bg-white shadow rounded">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
        ))}
      </div>
    </div>
  );
}
