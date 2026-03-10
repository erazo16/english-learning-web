'use client'
import { getTopics, Topic } from '@/lib/api';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
   const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopics().then(data => {
      setTopics(data);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-12'
      >
        <div className='flex items-center justify-center gap-3 mb-4'>
          <Sparkles className='w-8 h-8 text-yellow-400' />
          <h1 className='text-5x1 md:text-7x1 font-bold gradient-text'>
            Aprendiendo con amor 🌙
          </h1>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        <div className='flex items-center justify-center gap-3 mb-4 mt-4'>
        <p className="text-xl text-black-300 max-w-2xl mx-auto">

          Esta pagina web esta diseñada para ti mi amor, puedas sacar todo tu potencial aprendiendo con amor.
          Encontraras ejercicios, cuentos y toda una ayuda para que puedas entender cada palabra, frase que aqui encuentres.

          Para iniciar con este aprendizaje solo selecciona en el menu izquierdo ya sea ejercicios o cuentos, o si estas en celular presiona
          el icono ☰
        </p>
        </div>
      </motion.div>
    </main>
  );
}
