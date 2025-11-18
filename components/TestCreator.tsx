import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Test, Question, Answer } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

const TestCreator = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useLocalStorage<Test[]>('tests', []);

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (testId) {
      const existingTest = tests.find(t => t.id === testId);
      if (existingTest) {
        setTitle(existingTest.title);
        setQuestions(existingTest.questions);
      }
    }
  }, [testId, tests]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: '',
      answers: [{ id: crypto.randomUUID(), text: '' }, { id: crypto.randomUUID(), text: '' }],
      correctAnswerId: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestionText = (qIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].text = text;
    setQuestions(newQuestions);
  };
  
  const removeQuestion = (qIndex: number) => {
    setQuestions(questions.filter((_, index) => index !== qIndex));
  };
  
  const addAnswer = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push({ id: crypto.randomUUID(), text: '' });
    setQuestions(newQuestions);
  };
  
  const updateAnswerText = (qIndex: number, aIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].text = text;
    setQuestions(newQuestions);
  };

  const setCorrectAnswer = (qIndex: number, answerId: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswerId = answerId;
    setQuestions(newQuestions);
  }

  const removeAnswer = (qIndex: number, aIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, index) => index !== aIndex);
    setQuestions(newQuestions);
  };

  const saveTest = () => {
    if (!title.trim()) {
        alert('Пожалуйста, введите название теста.');
        return;
    }
    if (questions.length === 0) {
        alert('Пожалуйста, добавьте хотя бы один вопрос.');
        return;
    }
    for (const q of questions) {
        if (!q.text.trim()) {
            alert('Пожалуйста, заполните тексты всех вопросов.');
            return;
        }
        if (q.answers.length < 2) {
            alert(`Вопрос "${q.text || ' '}" должен иметь как минимум два варианта ответа.`);
            return;
        }
        for (const a of q.answers) {
            if (!a.text.trim()) {
                alert(`Пожалуйста, заполните тексты всех ответов для вопроса "${q.text}".`);
                return;
            }
        }
        if (!q.correctAnswerId) {
            alert(`Пожалуйста, выберите правильный ответ для вопроса "${q.text}".`);
            return;
        }
    }

    if (testId) {
        const updatedTests = tests.map(t => t.id === testId ? { ...t, title, questions } : t);
        setTests(updatedTests);
    } else {
        const newTest: Test = {
            id: crypto.randomUUID(),
            title,
            questions,
            teacherId: user!.id,
            teacherName: user!.fullName,
        };
        setTests([...tests, newTest]);
    }
    navigate('/');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800">{testId ? 'Редактировать тест' : 'Создать новый тест'}</h1>
            <div>
                <button onClick={() => navigate('/')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mr-2">Отмена</button>
                <button onClick={saveTest} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Сохранить тест</button>
            </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <label htmlFor="test-title" className="block text-sm font-medium text-gray-700">Название теста</label>
            <input 
                type="text" 
                id="test-title" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="например, Тест по английской лексике"
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
        </div>

        <div className="space-y-6">
            {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <textarea 
                            value={q.text}
                            onChange={e => updateQuestionText(qIndex, e.target.value)}
                            placeholder={`Вопрос ${qIndex + 1}`}
                            className="flex-grow mr-4 w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            rows={2}
                        />
                        <button onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors">
                            <TrashIcon />
                        </button>
                    </div>

                    <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                        <h4 className="font-semibold text-slate-600">Варианты ответа:</h4>
                        {q.answers.map((a, aIndex) => (
                            <div key={a.id} className="flex items-center gap-3">
                                <input type="radio" name={`correct-answer-${q.id}`} checked={q.correctAnswerId === a.id} onChange={() => setCorrectAnswer(qIndex, a.id)} className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300" />
                                <input 
                                    type="text" 
                                    value={a.text}
                                    onChange={e => updateAnswerText(qIndex, aIndex, e.target.value)}
                                    placeholder={`Ответ ${aIndex + 1}`}
                                    className="flex-grow w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                                {q.answers.length > 2 && (
                                    <button onClick={() => removeAnswer(qIndex, aIndex)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addAnswer(qIndex)} className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800 font-medium transition-colors">
                           <PlusIcon className="w-4 h-4"/> Добавить ответ
                        </button>
                    </div>
                </div>
            ))}
        </div>
        
        <button onClick={addQuestion} className="mt-6 flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
            <PlusIcon /> Добавить вопрос
        </button>
    </div>
  );
};

export default TestCreator;