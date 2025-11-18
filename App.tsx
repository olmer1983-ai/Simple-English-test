
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import TestCreator from './components/TestCreator';
import ResultsViewer from './components/ResultsViewer';
import TestTaker from './components/TestTaker';
import TestResultScreen from './components/TestResultScreen';

const App = () => {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
};

const Main = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {user.role === 'teacher' ? <TeacherRoutes /> : <StudentRoutes />}
    </div>
  );
};

const TeacherRoutes = () => (
  <Routes>
    <Route path="/" element={<TeacherDashboard />} />
    <Route path="/create-test" element={<TestCreator />} />
    <Route path="/edit-test/:testId" element={<TestCreator />} />
    <Route path="/results" element={<ResultsViewer />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const StudentRoutes = () => (
  <Routes>
    <Route path="/" element={<StudentDashboard />} />
    <Route path="/take-test/:testId" element={<TestTaker />} />
    <Route path="/result/:resultId" element={<TestResultScreen />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default App;
