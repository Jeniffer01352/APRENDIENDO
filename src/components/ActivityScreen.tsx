import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { UserProfile, Activity, AvatarExpression } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { generateFeedback } from '../services/geminiService';
import { Mic, MicOff, Volume2, X, Sparkles } from 'lucide-react';
import Avatar from './Avatar';

interface ActivityScreenProps {
  profile: UserProfile;
  activity: Activity;
  onFinish: (isCorrect: boolean, feedback: string) => void;
  onCancel: () => void;
}

const ActivityScreen: React.FC<ActivityScreenProps> = ({ 
  profile, 
  activity, 
  onFinish,
  onCancel
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { isSpeaking } = useSpeechSynthesis(
    activity.instruction, 
    profile.assistantVoice
  );

  const handleResult = useCallback((transcript: string, isFinal: boolean) => {
    if (isFinal) {
      const normalizedTranscript = transcript.toLowerCase().trim();
      const match = activity.options.find(opt => 
        normalizedTranscript.includes(opt.toLowerCase()) || 
        opt.toLowerCase().includes(normalizedTranscript)
      );
      
      if (match) {
        handleOptionSelect(match);
      }
    }
  }, [activity.options]);

  const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition({
    onResult: handleResult
  });

  const handleOptionSelect = async (option: string) => {
    if (isProcessing) return;
    
    setSelectedOption(option);
    setIsProcessing(true);
    stopListening();

    const isCorrect = option.toLowerCase() === activity.correctAnswer.toLowerCase();
    
    try {
      const feedback = await generateFeedback(
        isCorrect, 
        profile.nickname || profile.name, 
        activity, 
        option
      );
      onFinish(isCorrect, feedback);
    } catch (error) {
      onFinish(isCorrect, isCorrect ? "¡Excelente!" : "¡Buen intento!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onCancel}
          className="p-3 bg-white rounded-2xl text-stone-400 hover:text-stone-900 shadow-sm border border-stone-100 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-stone-100">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-stone-600">Actividad Mágica</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[3.5rem] p-10 border border-stone-100 shadow-xl shadow-stone-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Avatar emoji={profile.avatar} expression={AvatarExpression.NEUTRAL} size="xl" />
        </div>

        <div className="relative z-10">
          {/* Avatar & Instruction */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <Avatar 
              emoji={profile.avatar} 
              expression={isSpeaking ? AvatarExpression.ENCOURAGING : AvatarExpression.NEUTRAL} 
              size="lg" 
            />
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-2">
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                Escucha con atención
              </div>
              <h2 className="text-3xl font-bold leading-tight text-stone-900">
                {activity.instruction}
              </h2>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activity.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionSelect(option)}
                disabled={isProcessing}
                className={`
                  p-8 rounded-[2rem] text-2xl font-bold transition-all border-2
                  ${selectedOption === option 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-stone-100 bg-stone-50 text-stone-700 hover:border-emerald-200 hover:bg-white'}
                `}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Voice Control */}
          <div className="mt-12 flex flex-col items-center gap-4">
            {isSupported ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all
                    ${isListening 
                      ? 'bg-rose-500 text-white animate-pulse shadow-rose-200' 
                      : 'bg-emerald-500 text-white shadow-emerald-200'}
                  `}
                >
                  {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </motion.button>
                <p className="text-stone-400 font-medium">
                  {isListening ? '¡Te escucho! Di tu respuesta...' : 'Toca el micro para hablar'}
                </p>
              </>
            ) : (
              <p className="text-stone-400 text-sm">El reconocimiento de voz no es compatible con este navegador.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityScreen;
