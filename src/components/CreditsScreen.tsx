import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Github, Heart } from 'lucide-react';

interface CreditsScreenProps {
  onBack: () => void;
}

const CreditsScreen: React.FC<CreditsScreenProps> = ({ onBack }) => {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-12"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al inicio
      </button>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Créditos</h2>
        <p className="text-stone-500 italic">Hecho con amor para el aprendizaje infantil</p>
      </div>

      <div className="space-y-12">
        <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Equipo de Desarrollo
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <span className="font-medium">Moritazzzz</span>
              <span className="text-stone-500 text-sm">Desarrollador Principal</span>
            </li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Github className="w-5 h-5" />
            Repositorio
          </h3>
          <p className="text-stone-600 mb-4">
            Este proyecto es de código abierto y está disponible en GitHub.
          </p>
          <a
            href="https://github.com/moritazzzz/APRENDIENDO"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:underline"
          >
            github.com/moritazzzz/APRENDIENDO
          </a>
        </section>

        <section className="text-center text-stone-400 text-sm">
          <p>© 2024 Aprendiendo - Hablando y Jugando</p>
          <p className="mt-2">Impulsado por Gemini AI</p>
        </section>
      </div>
    </div>
  );
};

export default CreditsScreen;
