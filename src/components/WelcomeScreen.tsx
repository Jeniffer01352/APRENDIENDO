import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const title = "Aprendiendo";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
          <Sparkles className="w-16 h-16 text-emerald-600" />
        </div>
        
        <h1 className="text-6xl font-bold tracking-tighter text-stone-900 mb-2">
          {title.split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>
        <p className="text-xl text-stone-500 font-medium italic">Hablando y Jugando</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-md text-stone-600 mb-12 leading-relaxed"
      >
        ¡Tu aventura mágica de lenguaje comienza aquí! Únete a nosotros para descubrir un mundo de sonidos y diversión.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="group relative flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700"
      >
        <Play className="w-6 h-6 fill-current" />
        ¡Empezar a Jugar!
        <motion.div
          className="absolute -inset-1 bg-emerald-400/20 rounded-2xl blur-lg -z-10"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    </div>
  );
};

export default WelcomeScreen;
