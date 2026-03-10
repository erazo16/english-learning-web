import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  levels: string[];
}

export interface Exercise {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface VocabularyItem {
  word: string;
  baseForm: string;
  meaning: string;
  pronunciation: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Story {
  title: string;
  content: string;
  level: string;
  vocabulary: VocabularyItem[];
  questions: Question[];
}

export const getTopics = () => api.get<Topic[]>('/topics').then(r => r.data);
export const getExercises = (topic: string, level: string) => 
  api.get<Exercise[]>(`/exercises?topic=${topic}&level=${level}`).then(r => r.data);

export const getStory = (level: string) => 
  api.get<Story>(`/stories?level=${level}`).then(r => r.data);

export default api;