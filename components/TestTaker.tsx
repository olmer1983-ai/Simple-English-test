import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Test, TestResult } from '../types';

type StudentAnswers = { [questionId: string]: string };

const TestTaker = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tests] = useLocalStorage<Test[]>('tests', []);
    const [results, setResults] = useLocalStorage<TestResult[]>('results', []);

    const [test, setTest] = useState<Test | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<StudentAnswers>({});

    useEffect(() => {
        const foundTest = tests.find(t => t.id === testId);
        if (foundTest) {
            setTest(foundTest);
        } else {
            navigate('/'); // Test not found, redirect
        }
    }, [testId, tests, navigate]);

    const handleAnswerSelect = (questionId: string, answerId: string) => {
        setAnswers({ ...answers, [questionId]: answerId });
    };

    const nextQuestion = () => {
        if (test && currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const submitTest = () => {
        if (!test) return;

        if (Object.keys(answers).length !== test.questions.length) {
            if (!window.confirm("У вас есть неотвеченные вопросы. Вы уверены, что хотите завершить тест?")) {
                return;
            }
        }

        let score = 0;
        test.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswerId) {
                score++;
            }
        });
        
        const newResult: TestResult = {
            id: crypto.randomUUID(),
            testId: test.id,
            studentId: user!.id,
            studentName: user!.fullName,
            score,
            totalQuestions: test.questions.length,
            date: new Date().toISOString()
        };

        setResults([...results, newResult]);
        navigate(`/result/${newResult.id}`);
    };

    if (!test) {
        return <div className="flex items-center justify-center h-screen"><p>Загрузка теста...</p></div>;
    }

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2">{test.title}</h1>
                <p className="text-center text-slate-500 mb-6">Вопрос {currentQuestionIndex + 1} из {test.questions.length}</p>
                
                <div className="mb-8">
                    <p className="text-xl font-semibold mb-6 text-slate-800">{currentQuestion.text}</p>
                    <div className="space-y-4">
                        {currentQuestion.answers.map(answer => (
                            <label key={answer.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-sky-50 transition-colors">
                                <input 
                                    type="radio" 
                                    name={`question-${currentQuestion.id}`}
                                    checked={answers[currentQuestion.id] === answer.id}
                                    onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                    className="h-5 w-5 text-sky-600 focus:ring-sky-500 border-gray-300"
                                />
                                <span className="ml-4 text-slate-700">{answer.text}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button 
                        onClick={prevQuestion} 
                        disabled={currentQuestionIndex === 0}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Назад
                    </button>
                    {currentQuestionIndex === test.questions.length - 1 ? (
                        <button 
                            onClick={submitTest}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Завершить тест
                        </button>
                    ) : (
                         <button 
                            onClick={nextQuestion}
                            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Далее
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestTaker;