
import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { playSound } from '../services/soundService';

interface WelcomeProps {
  onStart: () => void;
  onRequestApiKey: () => void;
  hasKey: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, onRequestApiKey, hasKey }) => {
  const handleStart = () => {
    playSound('click');
    onStart();
  };

  const handleRequestKey = () => {
    playSound('click');
    onRequestApiKey();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-afro-bg text-center">
      <div className="mb-8 relative">
        <div className="w-32 h-32 bg-afro-terracotta rounded-full flex items-center justify-center animate-bounce">
             <Globe size={64} className="text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-afro-primary w-12 h-12 rounded-full flex items-center justify-center border-4 border-white">
            <span className="text-xl">🇳🇬</span>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-afro-indigo mb-4 tracking-tight">
        Afro<span className="text-afro-primary">Lingo</span>
      </h1>
      
      <p className="text-lg text-gray-600 max-w-md mb-12">
        Learn Hausa, Yoruba, Igbo and more with AI-generated lessons and art.
      </p>

      {!hasKey ? (
        <div className="w-full max-w-sm space-y-4">
             <button 
                onClick={handleRequestKey}
                className="w-full py-4 bg-afro-dark text-white rounded-2xl font-bold text-lg uppercase tracking-wider border-b-4 border-black hover:bg-gray-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Connect AI Key
              </button>
              <p className="text-xs text-gray-500">
                Requires a Google Cloud Project with Gemini API enabled.
              </p>
        </div>
      ) : (
        <button 
          onClick={handleStart}
          className="w-full max-w-sm py-4 bg-afro-primary text-white rounded-2xl font-bold text-lg uppercase tracking-wider border-b-4 border-green-700 hover:bg-green-500 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          Get Started <ArrowRight size={20} />
        </button>
      )}
      
      <footer className="mt-16 text-sm text-gray-400 font-semibold">
        Powered by Gemini 2.5 Flash Lite & 3 Pro
      </footer>
    </div>
  );
};

export default Welcome;
