import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, AvatarExpression } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { Trophy, ArrowRight, RefreshCw, Star } from 'lucide-react';
import Avatar from './Avatar';

interface FeedbackScreenProps {
  isCorrect: boolean;
  feedback: string;
  profile: UserProfile;
  onNext: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ 
  isCorrect, 
  feedback, 
  profile,
  onNext 
}) => {
  useSpeechSynthesis(feedback, profile.assistantVoice);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center py-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="mb-10"
      >
        <div className="relative">
          <Avatar 
            emoji={profile.avatar} 
            expression={isCorrect ? AvatarExpression.HAPPY : AvatarExpression.ENCOURAGING} 
            size="xl" 
          />
          {isCorrect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-6 -right-6 bg-amber-400 p-4 rounded-full shadow-lg border-4 border-white"
            >
              <Trophy className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-xl"
      >
        <h2 className={`text-5xl font-black mb-6 tracking-tight ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
          {isCorrect ? '¡FANTÁSTICO!' : '¡CASI LO TIENES!'}
        </h2>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/40 mb-10">
          <p className="text-2xl font-bold text-stone-700 leading-relaxed">
            {feedback}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className={`
              flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-bold text-xl shadow-xl transition-all
              ${isCorrect 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' 
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100'}
            `}
          >
            {isCorrect ? (
              <>
                Siguiente Aventura
                <ArrowRight className="w-6 h-6" />
              </>
            ) : (
              <>
                Intentar de nuevo
                <RefreshCw className="w-6 h-6" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {isCorrect && (
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 10,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 1
              }}
              animate={{ 
                y: -100,
                rotate: 360,
                opacity: 0
              }}
              transition={{ 
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                repeat: Infinity
              }}
              className="absolute"
            >
              <Star className="text-amber-400 fill-amber-400 w-6 h-6" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackScreen;
