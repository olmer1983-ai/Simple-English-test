import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Test, TestResult } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ResultsViewer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests] = useLocalStorage<Test[]>('tests', []);
  const [results] = useLocalStorage<TestResult[]>('results', []);
  const [selectedTestId, setSelectedTestId] = useState<string>('');

  const teacherTests = tests.filter(test => test.teacherId === user?.id);

  const filteredResults = results.filter(result => result.testId === selectedTestId);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Результаты учеников</h1>
        <button onClick={() => navigate('/')} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Назад к панели
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <label htmlFor="test-select" className="block text-lg font-medium text-gray-700 mb-2">Выберите тест для просмотра результатов:</label>
        <select 
          id="test-select"
          value={selectedTestId}
          onChange={e => setSelectedTestId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">-- Выберите тест --</option>
          {teacherTests.map(test => (
            <option key={test.id} value={test.id}>{test.title}</option>
          ))}
        </select>
      </div>

      {selectedTestId && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {filteredResults.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя ученика</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Результат</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Процент</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата прохождения</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResults.sort((a,b) => b.score - a.score).map(result => (
                            <tr key={result.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.studentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.score} / {result.totalQuestions}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {((result.score / result.totalQuestions) * 100).toFixed(0)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(result.date).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">Для этого теста еще нет результатов.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default ResultsViewer;