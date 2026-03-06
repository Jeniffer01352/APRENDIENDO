import React from 'react';
import { motion } from 'motion/react';
import { UserProfile, SessionRecord } from '../types';
import { Trophy, Star, ArrowRight, Home } from 'lucide-react';
import Avatar from './Avatar';
import { AvatarExpression } from '../types';

interface SessionEndScreenProps {
  profile: UserProfile;
  session: SessionRecord;
  onFinish: () => void;
}

const SessionEndScreen: React.FC<SessionEndScreenProps> = ({ 
  profile, 
  session, 
  onFinish 
}) => {
  const correctCount = session.activities.filter(a => a.isCorrect).length;
  const totalCount = session.activities.length;
  const percentage = Math.round((correctCount / totalCount) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-10"
      >
        <Avatar emoji={profile.avatar} expression={AvatarExpression.HAPPY} size="xl" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl w-full"
      >
        <h2 className="text-5xl font-black mb-4 tracking-tight text-stone-900">
          ¡SESIÓN COMPLETADA!
        </h2>
        <p className="text-xl text-stone-500 font-medium mb-12">
          ¡Qué gran esfuerzo has hecho hoy, {profile.nickname || profile.name}!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-emerald-600 fill-emerald-600" />
            </div>
            <div className="text-3xl font-black text-stone-900">{correctCount}</div>
            <div className="text-sm font-bold text-stone-400 uppercase tracking-widest">Aciertos</div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <div className="bg-amber-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-amber-600 fill-amber-600" />
            </div>
            <div className="text-3xl font-black text-stone-900">{percentage}%</div>
            <div className="text-sm font-bold text-stone-400 uppercase tracking-widest">Precisión</div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <div className="bg-indigo-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-indigo-600 fill-indigo-600" />
            </div>
            <div className="text-3xl font-black text-stone-900">+{correctCount * 10}</div>
            <div className="text-sm font-bold text-stone-400 uppercase tracking-widest">Puntos</div>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="flex items-center justify-center gap-3 w-full bg-stone-900 text-white py-6 rounded-[2rem] font-bold text-xl shadow-2xl hover:bg-stone-800 transition-all"
        >
          <Home className="w-6 h-6" />
          Volver al Mapa
        </button>
      </motion.div>
    </div>
  );
};

export default SessionEndScreen;
