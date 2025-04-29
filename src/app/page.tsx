"use client";
import { useEffect, useState } from 'react';
import TodoItem from '@/components/TodoItem';
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Todo = {
  _id: string;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { data: session, status } = useSession();
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((todo) => todo._id === active.id);
      const newIndex = todos.findIndex((todo) => todo._id === over?.id);
      const newTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(newTodos);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      {session && (
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Welcome, {session.user?.email || 'User'} 👋</span>
          <button
            onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
            className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
          >
            Sign Out
          </button>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App 🚀</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1 rounded"
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

      <div className="bg-white shadow rounded overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTodos.map((todo) => todo._id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTodos.map((todo) => (
              <SortableTodoItem key={todo._id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableTodoItem({ todo, onToggle, onDelete }: { todo: Todo; onToggle: any; onDelete: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    </div>
  );
}
