import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { TestResult, Test } from '../types';

const TestResultScreen = () => {
    const { resultId } = useParams<{ resultId: string }>();
    const navigate = useNavigate();
    const [results] = useLocalStorage<TestResult[]>('results', []);
    const [tests] = useLocalStorage<Test[]>('tests', []);

    const [result, setResult] = useState<TestResult | null>(null);
    const [testTitle, setTestTitle] = useState('');

    useEffect(() => {
        const foundResult = results.find(r => r.id === resultId);
        if (foundResult) {
            setResult(foundResult);
            const foundTest = tests.find(t => t.id === foundResult.testId);
            if (foundTest) {
                setTestTitle(foundTest.title);
            }
        } else {
            navigate('/');
        }
    }, [resultId, results, tests, navigate]);
    
    if (!result) {
        return <div>Загрузка результатов...</div>;
    }

    const percentage = ((result.score / result.totalQuestions) * 100).toFixed(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-cyan-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Тест завершен!</h1>
                <p className="text-slate-600 mb-6">Вот ваши результаты по тесту "{testTitle}".</p>

                <div className="my-8">
                     <p className="text-6xl font-extrabold text-sky-600">{percentage}%</p>
                     <p className="text-xl font-semibold text-slate-700 mt-2">
                        Ваш результат {result.score} из {result.totalQuestions}
                     </p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Назад к панели
                </button>
            </div>
        </div>
    );
};

export default TestResultScreen;