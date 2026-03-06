import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, Activity } from '../types';
import { generateActivity } from '../services/geminiService';
import { 
  Trophy, 
  Settings, 
  LogOut, 
  History, 
  Star, 
  Map as MapIcon,
  Play
} from 'lucide-react';
import Avatar from './Avatar';
import { AvatarExpression } from '../types';

interface LevelMapScreenProps {
  profile: UserProfile;
  onStartActivity: (activity: Activity) => void;
  onOpenPreferences: () => void;
  onOpenHistory: () => void;
  onLogout: () => void;
}

const LevelMapScreen: React.FC<LevelMapScreenProps> = ({ 
  profile, 
  onStartActivity,
  onOpenPreferences,
  onOpenHistory,
  onLogout
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlay = async () => {
    setIsGenerating(true);
    try {
      const activity = await generateActivity(profile, profile.history[0]?.activities || []);
      onStartActivity(activity);
    } catch (error) {
      alert("Error al generar la actividad. Por favor intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const levels = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-100">
        <div className="flex items-center gap-4">
          <Avatar emoji={profile.avatar} expression={AvatarExpression.NEUTRAL} size="sm" />
          <div>
            <h2 className="text-xl font-bold">{profile.nickname || profile.name}</h2>
            <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {profile.score} puntos • Nivel {profile.currentLevel}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button onClick={onOpenHistory} className="p-3 hover:bg-stone-100 rounded-2xl transition-colors text-stone-500" title="Historial">
            <History className="w-5 h-5" />
          </button>
          <button onClick={onOpenPreferences} className="p-3 hover:bg-stone-100 rounded-2xl transition-colors text-stone-500" title="Preferencias">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="p-3 hover:bg-rose-50 rounded-2xl transition-colors text-rose-500" title="Salir">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="relative bg-white rounded-[3rem] p-10 border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <MapIcon className="w-full h-full" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-2">Tu Mapa de Aventuras</h3>
            <p className="text-stone-500 font-medium">¡Sigue el camino para aprender más!</p>
          </div>

          {/* Path Visualization */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-8 max-w-2xl mx-auto">
            {levels.map((lvl) => {
              const isCompleted = lvl < profile.currentLevel;
              const isCurrent = lvl === profile.currentLevel;
              const isLocked = lvl > profile.currentLevel;

              return (
                <div key={lvl} className="flex flex-col items-center gap-2">
                  <motion.div
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all
                      ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : ''}
                      ${isCurrent ? 'bg-amber-400 text-white shadow-xl shadow-amber-100 ring-4 ring-amber-100' : ''}
                      ${isLocked ? 'bg-stone-100 text-stone-300' : ''}
                    `}
                  >
                    {isCompleted ? <Trophy className="w-6 h-6" /> : lvl}
                  </motion.div>
                  {isCurrent && (
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-[10px] font-bold text-amber-500 uppercase tracking-widest"
                    >
                      ¡Aquí!
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              disabled={isGenerating}
              className={`
                flex items-center gap-3 px-12 py-6 rounded-[2rem] font-bold text-2xl shadow-2xl transition-all
                ${isGenerating 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  Preparando...
                </>
              ) : (
                <>
                  <Play className="w-8 h-8 fill-current" />
                  ¡Jugar Ahora!
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelMapScreen;
