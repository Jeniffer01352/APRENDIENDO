
import { useEffect, useRef, useState, useContext } from 'react';
import { AssistantVoice } from '../types';
import { SoundContext } from '../contexts/SoundContext';

export const useSpeechSynthesis = (text: string, preferredVoice: AssistantVoice, onEnd?: () => void) => {
  const synth = useRef<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { isMuted, volume } = useContext(SoundContext);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synth.current = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      };

      loadVoices();

      if (synth.current) {
        synth.current.onvoiceschanged = loadVoices;
      }

      const intervalId = setInterval(() => {
        if (voices.length === 0) {
            loadVoices();
        } else {
            clearInterval(intervalId);
        }
      }, 500);

      return () => {
          clearInterval(intervalId);
          if (synth.current) {
              synth.current.onvoiceschanged = null;
          }
      }
    }
  }, [voices.length]);

  useEffect(() => {
    if (text && synth.current && !isMuted) {
      synth.current.cancel(); 

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9; 
      utterance.pitch = 1.0;
      utterance.volume = volume;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = (event) => {
        console.warn("Speech synthesis error:", event);
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      if (voices.length > 0) {
          const spanishVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));

          let selectedVoice: SpeechSynthesisVoice | undefined;

          if (spanishVoices.length > 0) {
              if (preferredVoice === AssistantVoice.MALE) {
                selectedVoice = spanishVoices.find(v => 
                    v.name.toLowerCase().includes('male') || 
                    v.name.toLowerCase().includes('hombre') ||
                    v.name.toLowerCase().includes('jorge') || 
                    v.name.toLowerCase().includes('pablo')
                );
              } else { 
                selectedVoice = spanishVoices.find(v => 
                    v.name.toLowerCase().includes('female') || 
                    v.name.toLowerCase().includes('mujer') ||
                    v.name.toLowerCase().includes('monica') || 
                    v.name.toLowerCase().includes('marisol')
                );
              }

              if (!selectedVoice) {
                  selectedVoice = spanishVoices.find(v => v.name.includes('Google'));
              }

              if (!selectedVoice) {
                  selectedVoice = spanishVoices[0];
              }
          }

          if (selectedVoice) {
              utterance.voice = selectedVoice;
          }
      }

      try {
          synth.current.speak(utterance);
      } catch (e) {
          console.error("Error calling speak:", e);
          setIsSpeaking(false);
      }

    } else if (synth.current) {
        synth.current.cancel();
        setIsSpeaking(false);
    }
  }, [text, preferredVoice, voices, isMuted, volume, onEnd]);

  return { isSpeaking };
};
