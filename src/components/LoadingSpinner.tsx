import React from 'react';
import { motion } from 'motion/react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"
      />
      <p className="text-stone-600 font-medium animate-pulse">Cargando magia...</p>
    </div>
  );
};

export default LoadingSpinner;
