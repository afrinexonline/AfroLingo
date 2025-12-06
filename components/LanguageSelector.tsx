
import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';
import { Language, UserState, DifficultyLevel } from '../types';
import UserProfile from './UserProfile';
import { X, Sprout, TreeDeciduous, MountainSnow } from 'lucide-react';
import { playSound } from '../services/soundService';

interface LanguageSelectorProps {
  onSelect: (lang: Language, difficulty: DifficultyLevel) => void;
  userState: UserState;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, userState }) => {
  const [selectedLangForSetup, setSelectedLangForSetup] = useState<Language | null>(null);

  const handleLanguageClick = (lang: Language) => {
    playSound('click');
    setSelectedLangForSetup(lang);
  };

  const handleDifficultySelect = (level: DifficultyLevel) => {
    playSound('click');
    if (selectedLangForSetup) {
      onSelect(selectedLangForSetup, level);
      setSelectedLangForSetup(null);
    }
  };

  const closeSetup = () => {
    playSound('click');
    setSelectedLangForSetup(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      
      {/* User Profile Stats */}
      <div className="w-full mt-4 mb-8">
        <UserProfile userState={userState} />
      </div>

      <h1 className="text-3xl font-extrabold text-afro-indigo mb-2 text-center">
        What would you like to learn?
      </h1>
      <p className="text-gray-500 mb-8 text-center">Select a Nigerian language to start your journey.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleLanguageClick(lang)}
            className="group relative flex items-center p-4 bg-white border-2 border-b-4 border-gray-200 hover:border-afro-primary hover:bg-green-50 rounded-2xl transition-all active:border-b-2 active:translate-y-[2px]"
          >
            <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">{lang.flag}</span>
            <div className="text-left">
              <span className="block font-bold text-lg text-gray-700 group-hover:text-afro-primary">
                {lang.name}
              </span>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Greeting: {lang.greeting}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Difficulty Selection Modal */}
      {selectedLangForSetup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
            <button 
              onClick={closeSetup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <span className="text-6xl mb-2 block">{selectedLangForSetup.flag}</span>
              <h2 className="text-2xl font-extrabold text-afro-indigo">
                {selectedLangForSetup.name} Course
              </h2>
              <p className="text-gray-500 text-sm">Select your difficulty level</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleDifficultySelect('Beginner')}
                className="w-full flex items-center p-4 rounded-xl border-2 border-b-4 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 active:border-b-2 active:translate-y-[2px] transition-all group"
              >
                <div className="bg-white p-2 rounded-lg mr-4 shadow-sm group-hover:scale-110 transition-transform">
                   <Sprout className="text-green-500 w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-green-800">Beginner</span>
                  <span className="text-xs text-green-600">Start from scratch. Basics & Greetings.</span>
                </div>
              </button>

              <button 
                onClick={() => handleDifficultySelect('Intermediate')}
                className="w-full flex items-center p-4 rounded-xl border-2 border-b-4 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 active:border-b-2 active:translate-y-[2px] transition-all group"
              >
                <div className="bg-white p-2 rounded-lg mr-4 shadow-sm group-hover:scale-110 transition-transform">
                   <TreeDeciduous className="text-yellow-600 w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-yellow-800">Intermediate</span>
                  <span className="text-xs text-yellow-700">Conversational phrases & grammar.</span>
                </div>
              </button>

              <button 
                onClick={() => handleDifficultySelect('Advanced')}
                className="w-full flex items-center p-4 rounded-xl border-2 border-b-4 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 active:border-b-2 active:translate-y-[2px] transition-all group"
              >
                <div className="bg-white p-2 rounded-lg mr-4 shadow-sm group-hover:scale-110 transition-transform">
                   <MountainSnow className="text-red-500 w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-red-800">Advanced</span>
                  <span className="text-xs text-red-600">Complex topics & fluency.</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LanguageSelector;
