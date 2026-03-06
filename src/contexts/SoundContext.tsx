
import React, { createContext, useState, ReactNode, useMemo } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMusicEnabled: boolean;
  toggleMusic: () => void;
}

export const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  toggleMute: () => {},
  volume: 1,
  setVolume: () => {},
  isMusicEnabled: false,
  toggleMusic: () => {},
});

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1); 
  const [isMusicEnabled, setIsMusicEnabled] = useState(false); 

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const toggleMusic = () => {
    setIsMusicEnabled(prev => !prev);
  };
  
  const handleSetVolume = (newVolume: number) => {
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
    setVolume(newVolume);
  };

  const value = useMemo(() => ({ 
    isMuted, 
    toggleMute, 
    volume, 
    setVolume: handleSetVolume,
    isMusicEnabled,
    toggleMusic
  }), [isMuted, volume, isMusicEnabled]);

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
