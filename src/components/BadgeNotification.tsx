import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../types';
import { Trophy } from 'lucide-react';

interface BadgeNotificationProps {
  badge: Badge | null;
  onClose: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onClose }) => {
  useEffect(() => {
    if (badge) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [badge, onClose]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
        >
          <div className="bg-white rounded-[2rem] shadow-2xl border-4 border-amber-400 p-6 flex items-center gap-6 overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
              <Trophy className="w-24 h-24 text-amber-500" />
            </div>
            
            <div className="text-5xl bg-amber-50 w-20 h-20 flex items-center justify-center rounded-2xl shadow-inner">
              {badge.icon}
            </div>
            
            <div>
              <p className="text-amber-600 font-black text-xs uppercase tracking-widest mb-1">¡Nuevo Logro!</p>
              <h3 className="text-xl font-black text-stone-900 leading-tight mb-1">{badge.name}</h3>
              <p className="text-stone-500 text-sm font-medium leading-snug">{badge.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeNotification;
