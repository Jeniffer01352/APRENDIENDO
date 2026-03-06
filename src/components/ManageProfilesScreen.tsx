import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { ArrowLeft, Trash2, Edit2, User } from 'lucide-react';

interface ManageProfilesScreenProps {
  profiles: UserProfile[];
  onEdit: (profile: UserProfile) => void;
  onDelete: (profileId: string) => void;
  onBack: () => void;
}

const ManageProfilesScreen: React.FC<ManageProfilesScreenProps> = ({ 
  profiles, 
  onEdit, 
  onDelete, 
  onBack 
}) => {
  return (
    <div className="py-12">
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={onBack}
          className="p-3 bg-stone-100 rounded-2xl text-stone-500 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-4xl font-bold tracking-tight">Gestionar Perfiles</h2>
      </div>

      <div className="space-y-4">
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="text-4xl bg-stone-50 w-16 h-16 flex items-center justify-center rounded-2xl">
                {profile.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">{profile.name}</h3>
                <p className="text-stone-400 text-sm">{profile.nickname ? `"${profile.nickname}" • ` : ''}Nivel {profile.currentLevel}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(profile)}
                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                title="Editar"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Estás seguro de que quieres eliminar el perfil de ${profile.name}?`)) {
                    onDelete(profile.id);
                  }
                }}
                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}

        {profiles.length === 0 && (
          <div className="text-center py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
            <User className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 font-medium">No hay perfiles para gestionar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProfilesScreen;
