
export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerId: string;
}

export interface Test {
  id: string;
  title: string;
  teacherId: string;
  teacherName: string;
  questions: Question[];
}

export type Role = 'teacher' | 'student';

export interface User {
  id: string;
  fullName: string;
  role: Role;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  date: string;
}
