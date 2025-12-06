
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

      <div className="text-center mb-8 relative">
        <h1 className="text-4xl font-extrabold text-afro-indigo mb-2">
          Choose a Path
        </h1>
        <div className="h-1 w-20 bg-afro-terracotta mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-2 font-medium">Select a Nigerian language to start your journey.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl mb-12">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => handleLanguageClick(lang)}
            className="kente-strip-bottom group relative flex items-center p-5 bg-white shadow-md hover:shadow-xl rounded-2xl transition-all hover:-translate-y-1"
          >
            {/* Subtle background texture for card */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] opacity-20 rounded-2xl"></div>
            
            <div className="w-16 h-16 bg-afro-bg rounded-full flex items-center justify-center text-4xl mr-5 border-2 border-afro-terracotta/20 shadow-inner group-hover:scale-110 transition-transform">
                {lang.flag}
            </div>
            
            <div className="text-left relative z-10">
              <span className="block font-bold text-xl text-afro-dark group-hover:text-afro-primary transition-colors">
                {lang.name}
              </span>
              <span className="text-xs text-afro-terracotta font-bold uppercase tracking-widest">
                {lang.greeting}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Difficulty Selection Modal */}
      {selectedLangForSetup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-afro-indigo/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 border-t-8 border-afro-terracotta">
            <button 
              onClick={closeSetup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-red-500 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8 mt-2">
              <div className="w-20 h-20 bg-afro-bg rounded-full flex items-center justify-center text-5xl mx-auto mb-4 border-4 border-white shadow-lg">
                {selectedLangForSetup.flag}
              </div>
              <h2 className="text-3xl font-extrabold text-afro-indigo">
                {selectedLangForSetup.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-afro-terracotta font-bold text-sm uppercase tracking-widest mt-1">
                 <span>Select Difficulty</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleDifficultySelect('Beginner')}
                className="w-full flex items-center p-4 rounded-xl border-2 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-400 hover:shadow-md transition-all group"
              >
                <div className="bg-white p-3 rounded-full mr-4 shadow-sm group-hover:scale-110 transition-transform text-green-600">
                   <Sprout size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-lg text-green-900">Beginner</span>
                  <span className="text-xs text-green-700 font-medium">Start from scratch. Basics.</span>
                </div>
              </button>

              <button 
                onClick={() => handleDifficultySelect('Intermediate')}
                className="w-full flex items-center p-4 rounded-xl border-2 border-yellow-100 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400 hover:shadow-md transition-all group"
              >
                <div className="bg-white p-3 rounded-full mr-4 shadow-sm group-hover:scale-110 transition-transform text-yellow-600">
                   <TreeDeciduous size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-lg text-yellow-900">Intermediate</span>
                  <span className="text-xs text-yellow-700 font-medium">Conversational phrases.</span>
                </div>
              </button>

              <button 
                onClick={() => handleDifficultySelect('Advanced')}
                className="w-full flex items-center p-4 rounded-xl border-2 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-400 hover:shadow-md transition-all group"
              >
                <div className="bg-white p-3 rounded-full mr-4 shadow-sm group-hover:scale-110 transition-transform text-red-600">
                   <MountainSnow size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-lg text-red-900">Advanced</span>
                  <span className="text-xs text-red-700 font-medium">Complex topics & fluency.</span>
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
