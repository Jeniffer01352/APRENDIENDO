import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GameState, 
  UserProfile, 
  Activity, 
  ThemeColor, 
  AssistantVoice, 
  SyllabicLevel, 
  LearningStyle, 
  SpecialNeed, 
  FocusArea,
  Difficulty,
  FontSize
} from './types';
import { SoundProvider } from './contexts/SoundContext';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileSelectionScreen from './components/ProfileSelectionScreen';
import ProfileSetupScreen from './components/ProfileSetupScreen';
import ActivityScreen from './components/ActivityScreen';
import FeedbackScreen from './components/FeedbackScreen';
import SessionEndScreen from './components/SessionEndScreen';
import LoadingSpinner from './components/LoadingSpinner';
import LevelMapScreen from './components/LevelMapScreen';
import PreferencesScreen from './components/PreferencesScreen';
import ManageProfilesScreen from './components/ManageProfilesScreen';
import SessionHistoryScreen from './components/SessionHistoryScreen';
import CreditsScreen from './components/CreditsScreen';
import ConnectionStatus from './components/ConnectionStatus';
import BadgeNotification from './components/BadgeNotification';
import SoundToggleButton from './components/SoundToggleButton';
import { checkConnection } from './services/geminiService';
import { Badge, SessionRecord } from './types';
import { AVAILABLE_BADGES } from './constants';
import { saveSession, getHistory, deleteHistory } from './services/historyService';

const LOCAL_STORAGE_KEY = 'aprendiendo_profiles';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [lastFeedback, setLastFeedback] = useState<string>('');
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [currentSession, setCurrentSession] = useState<SessionRecord | null>(null);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // Load profiles from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (e) {
        console.error("Error parsing profiles:", e);
      }
    }
    
    // Check backend connection
    checkConnection().then(setIsConnected);
  }, []);

  // Save profiles to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const handleCreateProfile = (newProfile: UserProfile) => {
    setProfiles(prev => [...prev, newProfile]);
    setCurrentProfile(newProfile);
    setGameState(GameState.LEVEL_MAP);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    if (currentProfile?.id === updatedProfile.id) {
      setCurrentProfile(updatedProfile);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    deleteHistory(profileId);
    if (currentProfile?.id === profileId) {
      setCurrentProfile(null);
      setGameState(GameState.PROFILE_SELECTION);
    }
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile);
    setGameState(GameState.LEVEL_MAP);
  };

  const handleStartActivity = (activity: Activity) => {
    setCurrentActivity(activity);
    setGameState(GameState.ACTIVITY);
  };

  const handleFinishActivity = (isCorrect: boolean, feedback: string) => {
    setIsLastAnswerCorrect(isCorrect);
    setLastFeedback(feedback);
    
    if (currentProfile && currentActivity) {
      const activityRecord = {
        instruction: currentActivity.instruction,
        userAnswer: isCorrect ? currentActivity.correctAnswer : 'incorrecto',
        correctAnswer: currentActivity.correctAnswer,
        isCorrect,
        difficulty: currentProfile.preferredDifficulty
      };

      // Update session
      const now = new Date().toISOString();
      if (!currentSession) {
        setCurrentSession({
          id: `session_${Date.now()}`,
          startTime: now,
          endTime: now,
          totalActivities: 1,
          totalCorrect: isCorrect ? 1 : 0,
          activities: [activityRecord]
        });
      } else {
        setCurrentSession(prev => prev ? {
          ...prev,
          endTime: now,
          totalActivities: prev.totalActivities + 1,
          totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect,
          activities: [...prev.activities, activityRecord]
        } : null);
      }

      // Update profile stats
      const updatedProfile = { ...currentProfile };
      updatedProfile.score += isCorrect ? 10 : 0;
      updatedProfile.correctAnswersStreak = isCorrect ? updatedProfile.correctAnswersStreak + 1 : 0;
      
      // Check for level up
      if (updatedProfile.correctAnswersStreak >= 5) {
        updatedProfile.currentLevel = Math.min(updatedProfile.currentLevel + 1, 15);
        updatedProfile.correctAnswersStreak = 0;

        // Promote SyllabicLevel
        if (updatedProfile.currentLevel >= 11) {
          updatedProfile.level = SyllabicLevel.ALFABETICO;
        } else if (updatedProfile.currentLevel >= 6) {
          updatedProfile.level = SyllabicLevel.SILABICO;
        }
      }

      // Check for badges
      const awardBadge = (badgeId: string) => {
        if (!updatedProfile.badges.includes(badgeId)) {
          updatedProfile.badges.push(badgeId);
          setNewBadge(AVAILABLE_BADGES.find(b => b.id === badgeId) || null);
        }
      };

      if (isCorrect) {
        awardBadge('first_steps');
        
        if (updatedProfile.correctAnswersStreak >= 5) awardBadge('high_five');
        if (updatedProfile.correctAnswersStreak >= 10) awardBadge('streak_fire');
        
        if (updatedProfile.score >= 20) awardBadge('super_star');
        if (updatedProfile.score >= 100) awardBadge('score_champion');
        
        if (updatedProfile.currentLevel >= 10) awardBadge('syllable_wizard');
        if (updatedProfile.level === SyllabicLevel.SILABICO) awardBadge('syllabic_explorer');
        if (updatedProfile.level === SyllabicLevel.ALFABETICO) awardBadge('alphabet_master');
        
        // Count total correct answers for style_master
        const history = getHistory(updatedProfile.id);
        const totalCorrect = history.reduce((acc, session) => 
          acc + session.totalCorrect, 0
        ) + (isCorrect ? 1 : 0);
        
        if (totalCorrect >= 20) awardBadge('style_master');
      }

      handleUpdateProfile(updatedProfile);
    }

    setGameState(GameState.FEEDBACK);
  };

  const handleSessionEnd = () => {
    if (currentProfile && currentSession) {
      const updatedProfile = { ...currentProfile };
      saveSession(updatedProfile.id, currentSession);
      
      const history = getHistory(updatedProfile.id);
      
      // Check for session_expert badge
      if (history.length >= 5 && !updatedProfile.badges.includes('session_expert')) {
        updatedProfile.badges.push('session_expert');
        setNewBadge(AVAILABLE_BADGES.find(b => b.id === 'session_expert') || null);
      }

      handleUpdateProfile(updatedProfile);
      setGameState(GameState.SESSION_END);
    }
  };

  const renderScreen = () => {
    switch (gameState) {
      case GameState.WELCOME:
        return <WelcomeScreen onStart={() => setGameState(profiles.length > 0 ? GameState.PROFILE_SELECTION : GameState.PROFILE_SETUP)} />;
      
      case GameState.PROFILE_SELECTION:
        return (
          <ProfileSelectionScreen 
            profiles={profiles} 
            onSelect={handleSelectProfile} 
            onCreateNew={() => setGameState(GameState.PROFILE_SETUP)}
            onManage={() => setGameState(GameState.MANAGE_PROFILES)}
          />
        );
      
      case GameState.PROFILE_SETUP:
        return (
          <ProfileSetupScreen 
            onSave={handleCreateProfile} 
            onCancel={() => setGameState(profiles.length > 0 ? GameState.PROFILE_SELECTION : GameState.WELCOME)} 
          />
        );

      case GameState.MANAGE_PROFILES:
        return (
          <ManageProfilesScreen
            profiles={profiles}
            onEdit={(p) => {
              setCurrentProfile(p);
              setGameState(GameState.PROFILE_SETUP);
            }}
            onDelete={handleDeleteProfile}
            onBack={() => setGameState(GameState.PROFILE_SELECTION)}
          />
        );

      case GameState.LEVEL_MAP:
        return currentProfile ? (
          <LevelMapScreen 
            profile={currentProfile} 
            onStartActivity={handleStartActivity}
            onOpenPreferences={() => setGameState(GameState.PREFERENCES)}
            onOpenHistory={() => setGameState(GameState.SESSION_HISTORY)}
            onLogout={() => {
              setCurrentProfile(null);
              setGameState(GameState.PROFILE_SELECTION);
            }}
          />
        ) : null;

      case GameState.ACTIVITY:
        return currentProfile && currentActivity ? (
          <ActivityScreen 
            profile={currentProfile} 
            activity={currentActivity} 
            onFinish={handleFinishActivity}
            onCancel={() => setGameState(GameState.LEVEL_MAP)}
          />
        ) : null;

      case GameState.FEEDBACK:
        return currentProfile && currentActivity ? (
          <FeedbackScreen 
            isCorrect={isLastAnswerCorrect} 
            feedback={lastFeedback} 
            profile={currentProfile}
            onNext={() => {
              if (currentSession && currentSession.activities.length >= 5) {
                handleSessionEnd();
              } else {
                setGameState(GameState.LEVEL_MAP);
              }
            }}
          />
        ) : null;

      case GameState.SESSION_END:
        return currentProfile && currentSession ? (
          <SessionEndScreen
            profile={currentProfile}
            session={currentSession}
            onFinish={() => {
              setCurrentSession(null);
              setGameState(GameState.LEVEL_MAP);
            }}
          />
        ) : null;

      case GameState.PREFERENCES:
        return currentProfile ? (
          <PreferencesScreen
            profile={currentProfile}
            onSave={(updated) => {
              handleUpdateProfile(updated);
              setGameState(GameState.LEVEL_MAP);
            }}
            onBack={() => setGameState(GameState.LEVEL_MAP)}
          />
        ) : null;

      case GameState.SESSION_HISTORY:
        return currentProfile ? (
          <SessionHistoryScreen
            profile={currentProfile}
            onBack={() => setGameState(GameState.LEVEL_MAP)}
          />
        ) : null;

      case GameState.CREDITS:
        return <CreditsScreen onBack={() => setGameState(GameState.WELCOME)} />;

      default:
        return <WelcomeScreen onStart={() => setGameState(GameState.PROFILE_SELECTION)} />;
    }
  };

  return (
    <SoundProvider>
      <div className={`min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100`}>
        <div className="fixed top-6 right-6 z-40 flex gap-2">
          <SoundToggleButton />
        </div>

        <BadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />
        <ConnectionStatus />
        
        <AnimatePresence mode="wait">
          <motion.main
            key={gameState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 py-8"
          >
            {renderScreen()}
          </motion.main>
        </AnimatePresence>

        {isLoading && <LoadingSpinner />}
      </div>
    </SoundProvider>
  );
}
