import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Test } from '../types';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useLocalStorage<Test[]>('tests', []);

  const teacherTests = tests.filter(test => test.teacherId === user?.id);

  const deleteTest = (testId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тест? Это действие нельзя отменить.')) {
        setTests(tests.filter(t => t.id !== testId));
    }
  }
  
  const getQuestionWord = (count: number) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'вопросов';
    }
    if (lastDigit === 1) {
        return 'вопрос';
    }
    if ([2, 3, 4].includes(lastDigit)) {
        return 'вопроса';
    }
    return 'вопросов';
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Панель учителя</h1>
          <p className="text-slate-600">Добро пожаловать, {user?.fullName}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Выйти
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/create-test" className="block p-6 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-transform hover:scale-105">
            <h2 className="text-2xl font-bold">Создать новый тест</h2>
            <p>Создайте новый тест с вопросами и ответами.</p>
        </Link>
        <Link to="/results" className="block p-6 bg-sky-500 text-white rounded-xl shadow-lg hover:bg-sky-600 transition-transform hover:scale-105">
            <h2 className="text-2xl font-bold">Результаты учеников</h2>
            <p>Проверьте успеваемость ваших учеников.</p>
        </Link>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-slate-700 mb-4">Мои тесты</h2>
        {teacherTests.length > 0 ? (
          <div className="space-y-4">
            {teacherTests.map(test => (
              <div key={test.id} className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-slate-800">{test.title}</h3>
                    <p className="text-sm text-slate-500">{test.questions.length} {getQuestionWord(test.questions.length)}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/edit-test/${test.id}`)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">Редактировать</button>
                    <button onClick={() => deleteTest(test.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">Удалить</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
             <p className="text-slate-500">Вы еще не создали ни одного теста.</p>
             <Link to="/create-test" className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Создать свой первый тест
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;