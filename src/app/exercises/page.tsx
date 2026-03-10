'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getTopics, Topic } from '@/lib/api';
import {
  Dumbbell,
  Target,
  Clock,
  ArrowRight,
  Trophy,
} from 'lucide-react';

export default function ExercisesPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTopics().then(data => {
      setTopics(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Ejercicios</h1>
        <p className="text-slate-500">Selecciona un tema y nivel para practicar</p>
      </div>

      <div className="space-y-8">
        {topics.map((topic, topicIdx) => (
          <motion.section
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: topicIdx * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl shadow-lg`}>
                {topic.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{topic.title}</h2>
                <p className="text-sm text-slate-500">{topic.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topic.levels.map((level) => (
                <Link
                  key={level}
                  href={`/exercises/practice?topic=${topic.id}&level=${level}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <span className="text-2xl font-bold text-slate-700 group-hover:text-blue-600">
                          {level}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-1">
                      Nivel {level}
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">
                      {level === 'A1' && 'Principiante - Conceptos básicos'}
                      {level === 'A2' && 'Básico - Comunicación simple'}
                      {level === 'B1' && 'Intermedio - Situaciones cotidianas'}
                      {level === 'B2' && 'Intermedio alto - Conversación fluida'}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Dumbbell className="w-4 h-4" />
                      <span>20 ejercicios</span>
                      <span>•</span>
                      <span>~15 min</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}