import React, { useContext } from 'react';
import { SoundContext } from '../contexts/SoundContext';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

const SoundToggleButton: React.FC = () => {
  const { isMuted, toggleMute } = useContext(SoundContext);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className={`p-3 rounded-2xl shadow-sm border transition-all ${isMuted ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-stone-100 text-stone-500'}`}
      title={isMuted ? "Activar sonido" : "Silenciar"}
    >
      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
    </motion.button>
  );
};

export default SoundToggleButton;
