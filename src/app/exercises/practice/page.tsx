'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getExercises, Exercise } from '@/lib/api';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic') || '';
  const level = searchParams.get('level') || '';

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const exercisesPerPage = 5;
  const totalPages = Math.ceil(exercises.length / exercisesPerPage);
  const currentExercises = exercises.slice(
    (currentPage - 1) * exercisesPerPage,
    currentPage * exercisesPerPage
  );

  useEffect(() => {
    getExercises(topic, level).then(data => {
      setExercises(data);
      setLoading(false);
    });
  }, [topic, level]);

  const handleAnswer = (exerciseId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const correctCount = exercises.filter(ex => answers[ex.id] === ex.correctAnswer).length;
  const percentage = Math.round((correctCount / exercises.length) * 100);

  const getMotivationalMessage = () => {
  if (percentage === 100)
    return {
      title: '¡Perfecto!',
      message: '¡Increíble mi amor! Lo lograste. Estoy muy orgulloso de lo inteligente y dedicada que eres.',
      color: 'from-yellow-400 to-orange-500'
    };

  if (percentage >= 80)
    return {
      title: '¡Excelente!',
      message: 'Muy buen trabajo mi niña hermosa. Cada día demuestras lo capaz e increíble que eres.',
      color: 'from-green-400 to-emerald-500'
    };

  if (percentage >= 60)
    return {
      title: '¡Bien hecho!',
      message: 'Vas muy bien amor, sigue así. Cada paso que das demuestra lo inteligente y fuerte que eres.',
      color: 'from-blue-400 to-cyan-500'
    };

  if (percentage >= 40)
    return {
      title: '¡Sigue adelante!',
      message: 'Cada paso que das te acerca más a tu meta. Sigue adelante mi niña hermosa, siempre estaré orgulloso de ti.',
      color: 'from-purple-400 to-pink-500'
    };

  return {
    title: '¡No te rindas!',
    message: 'Recuerda siempre lo inteligente y capaz que eres mi amor. Yo creo en ti y sé que puedes lograrlo.',
    color: 'from-orange-400 to-red-500'
  };
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const motivational = getMotivationalMessage();
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-3xl p-8 bg-gradient-to-br ${motivational.color} text-white mb-6`}>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              {percentage >= 60 ? '🎉' : '💪'}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">{motivational.title}</h2>
            <p className="text-white/90 mb-6">{motivational.message}</p>
            
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold">{percentage}%</p>
                <p className="text-sm text-white/80">de acierto</p>
              </div>
              <div className="w-px h-16 bg-white/30" />
              <div className="text-center">
                <p className="text-4xl font-bold">{correctCount}/{exercises.length}</p>
                <p className="text-sm text-white/80">correctas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Revisión de respuestas
            </h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {exercises.map((exercise, idx) => {
              const userAnswer = answers[exercise.id];
              const isCorrect = userAnswer === exercise.correctAnswer;

              return (
                <div key={exercise.id} className={`p-4 ${isCorrect ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-2">
                        <span className="text-slate-400 mr-2">{idx + 1}.</span>
                        {exercise.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          Tu respuesta: {userAnswer || 'Sin respuesta'}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            Correcta: {exercise.correctAnswer}
                          </p>
                        )}
                        <div className="flex items-start gap-2 mt-2 p-3 bg-white rounded-xl border border-slate-100">
                          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-600">{exercise.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Intentar de nuevo
          </button>
          <Link
            href="/exercises"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            Más ejercicios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/exercises"
          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 capitalize">
            {topic.replace(/-/g, ' ')}
          </h1>
          <p className="text-sm text-slate-500">Nivel {level} • Ejercicios {currentPage} de {totalPages}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>{Object.keys(answers).length}/{exercises.length}</span>
        </div>
      </div>

      <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(Object.keys(answers).length / exercises.length) * 100}%` }}
        />
      </div>

      <div className="space-y-4 mb-8">
        <AnimatePresence mode="wait">
          {currentExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 border border-slate-200"
            >
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {(currentPage - 1) * exercisesPerPage + index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">
                    {exercise.question}
                  </h3>
                  <div className="space-y-2">
                    {exercise.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswer(exercise.id, option)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          answers[exercise.id] === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {currentPage === totalPages ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Ver resultados
          </button>
        ) : (
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Siguiente
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96">Cargando...</div>}>
      <PracticeContent />
    </Suspense>
  );
}