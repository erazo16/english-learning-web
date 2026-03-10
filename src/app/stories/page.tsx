'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Languages,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LevelInfo {
  level: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  features: string[];
}

const levels: LevelInfo[] = [
  {
    level: 'A1',
    title: 'Principiante',
    description: 'Historias cortas con oraciones simples y vocabulario básico. Perfecto para empezar.',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200 hover:border-green-400',
    icon: '🌱',
    features: ['Vocabulario básico', 'Oraciones cortas', 'Presente simple'],
  },
  {
    level: 'A2',
    title: 'Básico',
    description: 'Cuentos cotidianos con descripciones y diálogos. Ideal para practicar situaciones reales.',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200 hover:border-blue-400',
    icon: '📚',
    features: ['Descripciones', 'Diálogos', 'Pasado simple'],
  },
  {
    level: 'B1',
    title: 'Intermedio',
    description: 'Narrativas más elaboradas con vocabulario variado. Para mejorar tu comprensión.',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200 hover:border-purple-400',
    icon: '🚀',
    features: ['Narrativa compleja', 'Vocabulario amplio', 'Expresiones idiomáticas'],
  },
];

export default function StoriesPage() {
  const router = useRouter();
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

  const handleSelectLevel = (level: string) => {
    router.push(`/stories/${level}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lectura interactiva</span>
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Cuentos</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Elige tu nivel y sumérgete en una historia adaptada para ti. 
          Haz clic en palabras para traducir y responde las preguntas al final.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-10"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Languages className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">¿Cómo funciona?</h3>
            <p className="text-purple-100 text-sm">
              1. Lee el cuento • 2. Haz clic en palabras desconocidas para traducir • 3. Responde 5 preguntas de comprensión
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {levels.map((levelInfo, idx) => (
          <motion.div
            key={levelInfo.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            onMouseEnter={() => setHoveredLevel(levelInfo.level)}
            onMouseLeave={() => setHoveredLevel(null)}
            onClick={() => handleSelectLevel(levelInfo.level)}
            className={`
              group relative bg-white rounded-3xl p-8 border-2 cursor-pointer
              transition-all duration-300 ${levelInfo.borderColor}
              ${hoveredLevel === levelInfo.level ? 'shadow-xl scale-105' : 'shadow-sm'}
            `}
          >
            <div className="text-6xl mb-6 text-center">{levelInfo.icon}</div>

            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${levelInfo.color} text-white`}>
              Nivel {levelInfo.level}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              {levelInfo.title}
            </h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              {levelInfo.description}
            </p>

            <div className="space-y-2 mb-8">
              {levelInfo.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${levelInfo.color}`} />
                  {feature}
                </div>
              ))}
            </div>

            <div className={`
              flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold
              transition-all duration-300
              ${hoveredLevel === levelInfo.level 
                ? `bg-gradient-to-r ${levelInfo.color} text-white shadow-lg` 
                : `${levelInfo.bgColor} text-slate-700`}
            `}>
              <BookOpen className="w-5 h-5" />
              <span>Comenzar a leer</span>
              <ArrowRight className={`w-5 h-5 transition-transform ${hoveredLevel === levelInfo.level ? 'translate-x-1' : ''}`} />
            </div>

            <div className={`absolute top-4 right-4 w-20 h-20 rounded-full ${levelInfo.bgColor} opacity-50 blur-2xl group-hover:opacity-100 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-slate-400 text-sm mt-10"
      >
        💡 Consejo: Si un nivel te resulta muy fácil o difícil, ¡prueba otro!
      </motion.p>
    </div>
  );
}