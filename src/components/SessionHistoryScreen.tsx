import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { ArrowLeft, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface SessionHistoryScreenProps {
  profile: UserProfile;
  onBack: () => void;
}

const SessionHistoryScreen: React.FC<SessionHistoryScreenProps> = ({ 
  profile, 
  onBack 
}) => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={onBack}
          className="p-3 bg-stone-100 rounded-2xl text-stone-500 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold tracking-tight">Tu Historial</h2>
      </div>

      <div className="space-y-6">
        {profile.history.length > 0 ? (
          profile.history.map((session, sIdx) => (
            <div key={sIdx} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-stone-400 font-bold text-sm uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {new Date(session.startTime).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>

              <div className="space-y-4">
                {session.activities.map((activity, aIdx) => (
                  <div key={aIdx} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                    <div className="flex-1">
                      <p className="font-bold text-stone-800 mb-1">{activity.instruction}</p>
                      <p className="text-sm text-stone-500">
                        Respuesta: <span className="font-bold text-stone-700">{activity.userAnswer}</span> • 
                        Correcta: <span className="font-bold text-emerald-600">{activity.correctAnswer}</span>
                      </p>
                    </div>
                    {activity.isCorrect ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-rose-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
            <p className="text-stone-500 font-medium italic">¡Aún no has jugado ninguna sesión! Empieza ahora para ver tu progreso.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionHistoryScreen;
