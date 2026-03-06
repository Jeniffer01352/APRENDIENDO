import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserProfile, 
  ThemeColor, 
  AssistantVoice, 
  SyllabicLevel, 
  LearningStyle, 
  SpecialNeed, 
  FocusArea,
  Difficulty,
  FontSize
} from '../types';
import { 
  AVATAR_OPTIONS, 
  THEME_OPTIONS, 
  VOICE_OPTIONS, 
  FOCUS_AREA_OPTIONS, 
  LEARNING_STYLE_OPTIONS, 
  SPECIAL_NEED_OPTIONS,
  DIFFICULTY_OPTIONS
} from '../constants';
import { ArrowLeft, Save, User, Sparkles, Brain, Heart } from 'lucide-react';

interface ProfileSetupScreenProps {
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  initialProfile?: UserProfile;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ 
  onSave, 
  onCancel,
  initialProfile 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>(initialProfile || {
    name: '',
    nickname: '',
    age: 5,
    avatar: AVATAR_OPTIONS[0],
    themeColor: ThemeColor.SKY,
    assistantVoice: AssistantVoice.FEMALE,
    focusAreas: [],
    learningStyle: LearningStyle.VISUAL,
    specialNeedType: SpecialNeed.OTHER,
    favoriteTopics: [],
    supportStrategies: [],
    level: SyllabicLevel.PRESILABICO,
    currentLevel: 1,
    score: 0,
    correctAnswersStreak: 0,
    history: [],
    badges: [],
    preferredDifficulty: Difficulty.NORMAL,
    fontSize: FontSize.NORMAL
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFocusArea = (area: FocusArea) => {
    setFormData(prev => {
      const areas = prev.focusAreas || [];
      if (areas.includes(area)) {
        return { ...prev, focusAreas: areas.filter(a => a !== area) };
      } else {
        return { ...prev, focusAreas: [...areas, area] };
      }
    });
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    const finalProfile: UserProfile = {
      ...formData as UserProfile,
      id: initialProfile?.id || Math.random().toString(36).substring(2, 9),
    };
    onSave(finalProfile);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Información Básica</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Juan Pérez"
                  className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Apodo (Cómo te llamaremos)</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="Ej. Juanito"
                  className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Edad</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="3"
                  max="12"
                  className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Avatar</label>
                <div className="flex flex-wrap gap-2 p-2 bg-stone-100 rounded-2xl">
                  {AVATAR_OPTIONS.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                      className={`text-3xl p-2 rounded-xl transition-all ${formData.avatar === avatar ? 'bg-white shadow-sm scale-110' : 'hover:bg-white/50'}`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Tu Estilo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Voz del Asistente</label>
                <div className="grid grid-cols-2 gap-3">
                  {VOICE_OPTIONS.map(voice => (
                    <button
                      key={voice}
                      onClick={() => setFormData(prev => ({ ...prev, assistantVoice: voice }))}
                      className={`p-4 rounded-2xl border-2 transition-all font-bold ${formData.assistantVoice === voice ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                    >
                      {voice}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Nivel Silábico Inicial</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                >
                  {Object.values(SyllabicLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Dificultad Preferida</label>
                <div className="flex gap-3">
                  {DIFFICULTY_OPTIONS.map(diff => (
                    <button
                      key={diff}
                      onClick={() => setFormData(prev => ({ ...prev, preferredDifficulty: diff }))}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all text-sm font-bold ${formData.preferredDifficulty === diff ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Perfil de Aprendizaje</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Necesidad Educativa (Opcional)</label>
                <select
                  name="specialNeedType"
                  value={formData.specialNeedType}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all font-medium"
                >
                  {SPECIAL_NEED_OPTIONS.map(need => (
                    <option key={need} value={need}>{need}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Estilo de Aprendizaje</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LEARNING_STYLE_OPTIONS.map(style => (
                    <button
                      key={style}
                      onClick={() => setFormData(prev => ({ ...prev, learningStyle: style }))}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${formData.learningStyle === style ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wider">Áreas de Enfoque</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOCUS_AREA_OPTIONS.map(area => (
                    <button
                      key={area}
                      onClick={() => toggleFocusArea(area)}
                      className={`p-3 rounded-xl border-2 transition-all text-left text-xs font-bold ${formData.focusAreas?.includes(area) ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Cancelar
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-12 h-2 rounded-full transition-all ${step >= i ? 'bg-emerald-500' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 mb-8">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center">
        {step > 1 ? (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition-all"
          >
            Anterior
          </button>
        ) : <div />}

        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && !formData.name}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <Save className="w-5 h-5" />
            Guardar Perfil
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
