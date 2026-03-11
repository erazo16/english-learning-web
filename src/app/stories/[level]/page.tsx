'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getStory, Story } from '@/lib/api';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  XCircle,
  Volume2,
  RotateCcw,
  Trophy,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const translationCache = new Map<string, { meaning: string; pronunciation: string }>();

export default function ReadPage() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const params = useParams();
  const level = params.level as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translation, setTranslation] = useState<{ meaning: string; pronunciation: string } | null>(null);
  const [translating, setTranslating] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!level) return;
    getStory(level).then((data) => {
      setStory(data);
      setLoading(false);
    });
  }, [level]);

  const handleWordClick = async (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:"()]/g, '');
    if (cleanWord.length < 2) return;

    setSelectedWord(word);
    setTranslating(true);

    if (translationCache.has(cleanWord)) {
      setTranslation(translationCache.get(cleanWord)!);
      setTranslating(false);
      return;
    }

    const vocabItem = story?.vocabulary.find(
      (v) => v.word.toLowerCase() === cleanWord || v.baseForm.toLowerCase() === cleanWord
    );

    if (vocabItem) {
      const result = { meaning: vocabItem.meaning, pronunciation: vocabItem.pronunciation };
      setTranslation(result);
      translationCache.set(cleanWord, result);
      setTranslating(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/translate?word=${encodeURIComponent(cleanWord)}`
      );
      const data = await response.json();
      const result = { meaning: data.translation || 'No disponible', pronunciation: data.pronunciation || 'N/A' };
      setTranslation(result);
      translationCache.set(cleanWord, result);
    } catch {
      setTranslation({ meaning: 'Error al traducir', pronunciation: 'N/A' });
    } finally {
      setTranslating(false);
    }
  };

  const handleSpeak = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const correctCount = story?.questions.filter((q) => answers[q.id] === q.correctAnswer).length || 0;
  const percentage = Math.round((correctCount / (story?.questions.length || 1)) * 100);
  const allAnswered = story?.questions.every((q) => answers[q.id]) || false;

  const renderParagraph = (paragraph: string, pIdx: number) => {
    const tokens = paragraph.split(/(\s+|[.,!?;:"()])/);
    return (
      <p key={pIdx} className="mb-6 leading-relaxed text-lg text-slate-700">
        {tokens.map((token, tIdx) => {
          if (!token.trim() || /^[.,!?;:"()]+$/.test(token)) {
            return <span key={tIdx}>{token}</span>;
          }
          const isClickable = token.length > 1 && !/^\d+$/.test(token);
          return (
            <span
              key={tIdx}
              onClick={() => isClickable && handleWordClick(token)}
              className={isClickable ? 'border-b border-dotted border-blue-300 hover:bg-blue-50 hover:border-blue-500 cursor-pointer transition-colors px-0.5 rounded' : ''}
            >
              {token}
            </span>
          );
        })}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Creando tu cuento...</p>
        </div>
      </div>
    );
  }

  if (!story) return null;

  if (showResults) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-3xl p-8 mb-6 ${percentage >= 60 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-orange-400 to-red-500'} text-white`}>
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">
              {percentage >= 60 ? '🎉' : '📚'}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">
              {percentage >= 60 ? '¡Excelente lectura!' : '¡Sigue practicando!'}
            </h2>
            <p className="text-white/90 mb-6">
              {percentage >= 60 ? 'Excelente mi amor, entendiste bien el cuento, sabia que podias lograrlo' : 'Sigue estudiando mi amor, se que podras lograrlo, ¡No te rindas!'}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold">{percentage}%</p>
                <p className="text-sm text-white/80">de acierto</p>
              </div>
              <div className="w-px h-16 bg-white/30" />
              <div className="text-center">
                <p className="text-4xl font-bold">{correctCount}/{story.questions.length}</p>
                <p className="text-sm text-white/80">correctas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-900">Revisión de respuestas</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {story.questions.map((q, idx) => {
              const isCorrect = answers[q.id] === q.correctAnswer;
              return (
                <div key={q.id} className={`p-4 ${isCorrect ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-2">{idx + 1}. {q.question}</p>
                      <p className={isCorrect ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                        Tu respuesta: {answers[q.id] || 'Sin respuesta'}
                      </p>
                      {!isCorrect && <p className="text-green-600 text-sm">Correcta: {q.correctAnswer}</p>}
                      <p className="text-slate-500 text-sm mt-2">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200">
            <RotateCcw className="w-5 h-5" />
            Leer de nuevo
          </button>
          <Link href="/stories" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-purple-500 text-white rounded-2xl font-semibold hover:bg-purple-600">
            <Trophy className="w-5 h-5" />
            Más cuentos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/stories" className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">Nivel {level}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{story.title}</h1>
        </div>
      </div>

      {selectedWord && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-4 top-24 md:absolute md:inset-auto md:top-0 md:right-0 md:w-72 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-purple-500 uppercase">Traducción</span>
              <button onClick={() => setSelectedWord(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            {translating ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-slate-900">{selectedWord}</h3>
                  <button onClick={() => handleSpeak(selectedWord)} className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center hover:bg-purple-100">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-400 italic mb-3">/{translation?.pronunciation || 'N/A'}/</p>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xl font-semibold text-purple-700">{translation?.meaning || 'No disponible'}</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm mb-8">
        <div className="prose prose-lg max-w-none">
          {story.content.split('\n').map((paragraph, idx) => renderParagraph(paragraph, idx))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm mb-8">
        <BookOpen className="w-5 h-5 flex-shrink-0" />
        <p>Haz clic en cualquier palabra para traducir. Responde las preguntas de comprensión abajo.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-500" />
          Preguntas de comprensión
        </h2>
        
        <div className="space-y-8">
          {story.questions.map((question, qIdx) => (
            <div key={question.id} className="border-b border-slate-100 last:border-0 pb-8 last:pb-0">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                <span className="text-purple-500 font-bold mr-2">{qIdx + 1}.</span>
                {question.question}
              </h3>
              
              <div className="grid gap-3">
                {question.options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      answers[question.id] === option
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-medium text-slate-400 mr-3">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
              allAnswered
                ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/25'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-6 h-6" />
            {allAnswered ? 'Ver mis resultados' : `Responde todas las preguntas (${Object.keys(answers).length}/${story.questions.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}