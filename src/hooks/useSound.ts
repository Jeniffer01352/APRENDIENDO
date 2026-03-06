import { useCallback, useContext, useMemo } from 'react';
import { SoundContext } from '../contexts/SoundContext';

export const useSound = (soundUrl: string) => {
    const { isMuted, volume } = useContext(SoundContext);

    const audio = useMemo(() => {
        if (typeof Audio !== "undefined") {
            const audioInstance = new Audio(soundUrl);
            audioInstance.preload = 'auto';
            return audioInstance;
        }
        return null;
    }, [soundUrl]);

    const play = useCallback(() => {
        if (!isMuted && audio) {
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play().catch(e => {
                console.log("Could not play sound automatically:", e);
            });
        }
    }, [isMuted, volume, audio]);

    return play;
};
