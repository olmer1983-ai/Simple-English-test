import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { User, Role } from '../types';

const LoginScreen = () => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const { login } = useAuth();
  const [users, setUsers] = useLocalStorage<User[]>('users', []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Пожалуйста, введите ваше полное имя.');
      return;
    }

    let user = users.find(u => u.fullName.toLowerCase() === fullName.toLowerCase() && u.role === role);

    if (!user) {
      user = { id: crypto.randomUUID(), fullName, role };
      setUsers([...users, user]);
    }
    
    login(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Платформа для тестов по английскому языку
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Войдите или зарегистрируйтесь, чтобы продолжить
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="full-name" className="sr-only">
                Полное имя
              </label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Полное имя (например, Иван Иванов)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-around">
            <div className="flex items-center">
              <input
                id="role-student"
                name="role"
                type="radio"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              <label htmlFor="role-student" className="ml-2 block text-sm text-gray-900">
                Я ученик
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="role-teacher"
                name="role"
                type="radio"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                checked={role === 'teacher'}
                onChange={() => setRole('teacher')}
              />
              <label htmlFor="role-teacher" className="ml-2 block text-sm text-gray-900">
                Я учитель
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Войти / Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;