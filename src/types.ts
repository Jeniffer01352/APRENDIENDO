
export enum ThemeColor {
  SKY = 'Cielo',
  MINT = 'Menta',
  LAVENDER = 'Lavanda',
  PEACH = 'Durazno',
  ROSE = 'Rosa',
  AMBER = 'Ámbar',
  CYAN = 'Cian',
  FUCHSIA = 'Fucsia',
}

export enum AssistantVoice {
  FEMALE = 'Femenina',
  MALE = 'Masculina',
}

export enum FocusArea {
  ADAPTIVE_AUTONOMY = 'Área adaptativa y de autonomía',
  SENSORY_PERCEPTUAL = 'Área sensorial–perceptiva',
  SOCIOEMOTIONAL = 'Área socioemocional',
  COMMUNICATION_LANGUAGE = 'Área comunicativa y del lenguaje',
  COGNITIVE_ACADEMIC = 'Área cognitiva–académica',
}

export enum LearningStyle {
  VISUAL = 'Visual',
  AUDITORY = 'Auditivo',
  READING_WRITING = 'Lectura/Escritura',
  SOCIAL = 'Social',
  INDIVIDUAL = 'Individual',
}

export enum SyllabicLevel {
  PRESILABICO = 'Presilábico',
  SILABICO = 'Silábico',
  ALFABETICO = 'Alfabético',
}

export enum SpecialNeed {
  DYSLEXIA = 'Dislexia',
  AUTISM_SPECTRUM = 'Espectro Autista',
  ADHD = 'TDAH',
  LANGUAGE_DISORDER_PHONOLOGICAL = 'Trastorno Fonológico',
  LANGUAGE_DISORDER_SEMANTIC = 'Trastorno Semántico',
  LANGUAGE_DISORDER_PRAGMATIC = 'Trastorno Pragmático',
  LANGUAGE_DISORDER_MIXED = 'Trastorno Mixto',
  INTELLECTUAL_DISABILITY = 'Discapacidad Intelectual',
  OTHER = 'Otro',
}

export enum Difficulty {
  EASY = 'Fácil',
  NORMAL = 'Normal',
  CHALLENGING = 'Desafiante',
}

export enum FontSize {
  NORMAL = 'Normal',
  MEDIUM = 'Mediana',
  LARGE = 'Grande',
}

export interface SessionActivityRecord {
    instruction: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    difficulty?: Difficulty;
}

export interface SessionRecord {
    id: string;
    startTime: string;
    endTime: string;
    totalActivities: number;
    totalCorrect: number;
    activities: SessionActivityRecord[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  age: number;
  avatar: string;
  themeColor: ThemeColor;
  assistantVoice: AssistantVoice;
  focusAreas: FocusArea[];
  learningStyle: LearningStyle;
  specialNeedType: SpecialNeed;
  favoriteTopics: string[];
  supportStrategies: string[];
  level: SyllabicLevel;
  currentLevel: number;
  score: number;
  correctAnswersStreak: number;
  badges: string[];
  preferredDifficulty?: Difficulty;
  dailySessionDuration?: number;
  favoriteGameTypes?: string;
  fontSize?: FontSize;
}

export enum GameState {
  WELCOME,
  PROFILE_SELECTION,
  PROFILE_SETUP,
  MANAGE_PROFILES,
  PREFERENCES,
  SESSION_REPORT,
  LOADING,
  ACTIVITY,
  FEEDBACK,
  SESSION_END,
  CREDITS,
  SESSION_HISTORY,
  LEVEL_MAP,
}

export interface Activity {
  instruction: string;
  options: string[];
  correctAnswer: string;
}

export enum AvatarExpression {
    NEUTRAL = 'neutral',
    HAPPY = 'happy',
    ENCOURAGING = 'encouraging',
}
