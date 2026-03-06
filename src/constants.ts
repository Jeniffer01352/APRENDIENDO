
import { ThemeColor, AssistantVoice, FocusArea, LearningStyle, SpecialNeed, Difficulty, FontSize, Badge, SyllabicLevel } from './types';

export const SYLLABIC_LEVEL_OPTIONS = Object.values(SyllabicLevel);
export const LEVEL_UP_SCORE = 5;
export const ACTIVITIES_PER_SESSION = 5;

export const AVATAR_OPTIONS = ['🦁', '🦋', '🦖', '🦄', '🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'];

export const THEME_OPTIONS = Object.values(ThemeColor);
export const VOICE_OPTIONS = Object.values(AssistantVoice);
export const FOCUS_AREA_OPTIONS = Object.values(FocusArea);
export const LEARNING_STYLE_OPTIONS = Object.values(LearningStyle);
export const SPECIAL_NEED_OPTIONS = Object.values(SpecialNeed);

export const DIFFICULTY_OPTIONS = Object.values(Difficulty);
export const FONT_SIZE_OPTIONS = Object.values(FontSize);
export const SESSION_DURATION_OPTIONS = [10, 15, 20, 25, 30];

export const AVAILABLE_BADGES: Badge[] = [
    {
        id: 'first_steps',
        name: 'Primeros Pasos',
        description: '¡Tu primer acierto!',
        icon: '👣'
    },
    {
        id: 'high_five',
        name: 'Choca esos cinco',
        description: 'Alcanza 5 aciertos seguidos (Racha)',
        icon: '🖐️'
    },
    {
        id: 'syllabic_explorer',
        name: 'Explorador Silábico',
        description: '¡Llegaste al nivel Silábico!',
        icon: '🚀'
    },
    {
        id: 'alphabet_master',
        name: 'Maestro Alfabético',
        description: '¡Llegaste al nivel Alfabético!',
        icon: '🎓'
    },
    {
        id: 'super_star',
        name: 'Súper Estrella',
        description: 'Acumula 20 puntos en total',
        icon: '⭐'
    },
    {
        id: 'streak_fire',
        name: 'Racha de Fuego',
        description: '¡10 aciertos seguidos! ¡Increíble!',
        icon: '🔥'
    },
    {
        id: 'session_expert',
        name: 'Experto en Sesiones',
        description: '¡Has completado 5 sesiones de aprendizaje!',
        icon: '📅'
    },
    {
        id: 'syllable_wizard',
        name: 'Mago de las Sílabas',
        description: '¡Has alcanzado el nivel 10!',
        icon: '🧙‍♂️'
    },
    {
        id: 'style_master',
        name: 'Maestro de Estilo',
        description: '¡Aprendes de una forma única y genial!',
        icon: '🎨'
    },
    {
        id: 'score_champion',
        name: 'Campeón de Puntos',
        description: '¡Has alcanzado los 100 puntos en total!',
        icon: '💎'
    }
];
