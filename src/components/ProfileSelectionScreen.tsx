import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Plus, Settings, User } from 'lucide-react';

interface ProfileSelectionScreenProps {
  profiles: UserProfile[];
  onSelect: (profile: UserProfile) => void;
  onCreateNew: () => void;
  onManage: () => void;
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ 
  profiles, 
  onSelect, 
  onCreateNew,
  onManage
}) => {
  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight">¿Quién va a jugar hoy?</h2>
        <button
          onClick={onManage}
          className="p-3 bg-stone-100 rounded-2xl text-stone-500 hover:bg-stone-200 transition-colors"
          title="Gestionar perfiles"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <motion.button
            key={profile.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(profile)}
            className="group bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100 transition-all text-center flex flex-col items-center"
          >
            <div className="text-6xl mb-6 bg-stone-50 w-24 h-24 flex items-center justify-center rounded-3xl group-hover:bg-emerald-50 transition-colors">
              {profile.avatar}
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-1">{profile.nickname || profile.name}</h3>
            <p className="text-stone-400 font-medium">Nivel {profile.currentLevel}</p>
          </motion.button>
        ))}

        <motion.button
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateNew}
          className="bg-stone-50 p-8 rounded-[2.5rem] border-2 border-dashed border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-center flex flex-col items-center justify-center min-h-[240px]"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Plus className="w-8 h-8 text-stone-400" />
          </div>
          <p className="font-bold text-stone-500">Nuevo Perfil</p>
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileSelectionScreen;
