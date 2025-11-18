import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Test, TestResult } from '../types';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [tests] = useLocalStorage<Test[]>('tests', []);
  const [results] = useLocalStorage<TestResult[]>('results', []);

  const studentResults = results.filter(r => r.studentId === user?.id);
  const completedTestIds = new Set(studentResults.map(r => r.testId));

  const availableTests = tests.filter(t => !completedTestIds.has(t.id));
  
  const findResultForTest = (testId: string) => {
    return studentResults.find(r => r.testId === testId);
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
          <h1 className="text-4xl font-bold text-slate-800">Панель ученика</h1>
          <p className="text-slate-600">Добро пожаловать, {user?.fullName}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Выйти
        </button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h2 className="text-3xl font-bold text-slate-700 mb-4">Доступные тесты</h2>
            {availableTests.length > 0 ? (
            <div className="space-y-4">
                {availableTests.map(test => (
                <div key={test.id} className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">{test.title}</h3>
                        <p className="text-sm text-slate-500">Создал: {test.teacherName}</p>
                        <p className="text-sm text-slate-500">{test.questions.length} {getQuestionWord(test.questions.length)}</p>
                    </div>
                    <Link to={`/take-test/${test.id}`} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                        Начать тест
                    </Link>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                <p className="text-slate-500">Нет доступных тестов. Загляните позже!</p>
            </div>
            )}
        </div>
        <div>
            <h2 className="text-3xl font-bold text-slate-700 mb-4">Пройденные тесты</h2>
             {studentResults.length > 0 ? (
            <div className="space-y-4">
                {tests.filter(t => completedTestIds.has(t.id)).map(test => {
                    const result = findResultForTest(test.id);
                    return (
                        <div key={test.id} className="bg-white p-5 rounded-lg shadow-md">
                           <div className="flex justify-between items-center">
                             <div>
                                <h3 className="text-xl font-semibold text-slate-800">{test.title}</h3>
                                <p className="text-sm text-slate-500">Создал: {test.teacherName}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-lg font-bold text-sky-600">Результат: {result?.score}/{result?.totalQuestions}</p>
                                <p className="text-xs text-slate-400">Пройден: {new Date(result?.date ?? '').toLocaleDateString()}</p>
                             </div>
                           </div>
                        </div>
                    );
                })}
            </div>
            ) : (
             <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                <p className="text-slate-500">Вы еще не прошли ни одного теста.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;