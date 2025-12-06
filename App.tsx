import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import LanguageSelector from './components/LanguageSelector';
import LessonScreen from './components/LessonScreen';
import { Language, UserState, DifficultyLevel } from './types';
import { hasApiKey } from './services/geminiService';
import { getUserState, saveUserState } from './services/storageService';

const App: React.FC = () => {
  // Initialize as false to ensure we explicitly check aistudio state
  const [hasKey, setHasKey] = useState(false);
  const [screen, setScreen] = useState<'welcome' | 'select' | 'lesson'>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Beginner');
  
  // User State management
  const [userState, setUserState] = useState<UserState>({ hearts: 5, xp: 0, streak: 0 });

  useEffect(() => {
    // Load user state from local storage
    const storedState = getUserState();
    setUserState(storedState);

    // Check key status on mount
    const checkKey = async () => {
       const aiStudio = (window as any).aistudio;
       if (aiStudio) {
         // Strictly check if a key has been selected in the UI
         const selected = await aiStudio.hasSelectedApiKey();
         setHasKey(selected);
       } else {
         // Fallback for environments where window.aistudio is not available
         setHasKey(hasApiKey());
       }
    };
    checkKey();
  }, []);

  const updateUser = (newState: UserState) => {
    setUserState(newState);
    saveUserState(newState);
  };

  const handleRequestKey = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      try {
        await aiStudio.openSelectKey();
        // Assume success to avoid race conditions as per guidelines
        setHasKey(true);
      } catch (e) {
        console.error("Key selection failed", e);
        // If it failed, re-verify state
        const selected = await aiStudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    } else {
        alert("AI Studio environment not detected. Please run in the correct environment.");
    }
  };

  const handleStart = () => {
    setScreen('select');
  };

  const handleSelectLanguage = (lang: Language, difficulty: DifficultyLevel) => {
    setSelectedLanguage(lang);
    setSelectedDifficulty(difficulty);
    setScreen('lesson');
  };

  const handleExitLesson = () => {
    setScreen('select');
    setSelectedLanguage(null);
  };

  return (
    <div className="min-h-screen bg-afro-bg text-gray-800 font-sans selection:bg-afro-primary selection:text-white">
      {screen === 'welcome' && (
        <Welcome 
            onStart={handleStart} 
            hasKey={hasKey} 
            onRequestApiKey={handleRequestKey}
        />
      )}
      
      {screen === 'select' && (
        <LanguageSelector 
          onSelect={handleSelectLanguage} 
          userState={userState}
        />
      )}

      {screen === 'lesson' && selectedLanguage && (
        <LessonScreen 
            language={selectedLanguage} 
            difficulty={selectedDifficulty}
            onExit={handleExitLesson}
            userState={userState}
            updateUser={updateUser}
        />
      )}
    </div>
  );
};

export default App;