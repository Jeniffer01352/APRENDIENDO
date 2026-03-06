import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, ThemeColor, AssistantVoice, FontSize, Difficulty } from '../types';
import { THEME_OPTIONS, VOICE_OPTIONS, FONT_SIZE_OPTIONS, DIFFICULTY_OPTIONS } from '../constants';
import { ArrowLeft, Save, Volume2, Type, Palette, Shield } from 'lucide-react';

interface PreferencesScreenProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onBack: () => void;
}

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ 
  profile, 
  onSave, 
  onBack 
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={onBack}
          className="p-3 bg-stone-100 rounded-2xl text-stone-500 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold tracking-tight">Preferencias</h2>
      </div>

      <div className="space-y-8">
        {/* Voice & Sound */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Voz y Sonido</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Voz del Asistente</label>
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
          </div>
        </section>

        {/* Accessibility */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
              <Type className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Accesibilidad</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Tamaño de Letra</label>
              <div className="grid grid-cols-3 gap-3">
                {FONT_SIZE_OPTIONS.map(size => (
                  <button
                    key={size}
                    onClick={() => setFormData(prev => ({ ...prev, fontSize: size }))}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${formData.fontSize === size ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Game Settings */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Ajustes de Juego</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">Dificultad</label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_OPTIONS.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setFormData(prev => ({ ...prev, preferredDifficulty: diff }))}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${formData.preferredDifficulty === diff ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-100 bg-white text-stone-500 hover:border-stone-200'}`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white py-6 rounded-[2rem] font-bold text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all mt-12"
        >
          <Save className="w-6 h-6" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default PreferencesScreen;
