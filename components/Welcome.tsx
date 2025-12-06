
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Decorative Circles Background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-afro-terracotta opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-afro-primary opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>

      <div className="mb-10 relative z-10">
        <div className="relative">
          {/* Sunburst effect behind icon */}
          <div className="absolute inset-0 bg-afro-gold rounded-full animate-pulse opacity-50 blur-xl scale-125"></div>
          <div className="w-40 h-40 bg-gradient-to-br from-afro-terracotta to-orange-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-afro-bg relative z-10">
               <Globe size={80} className="text-white" />
          </div>
          <div className="absolute -bottom-4 -right-2 bg-afro-primary w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20 rotate-12">
              <span className="text-3xl">🇳🇬</span>
          </div>
        </div>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold text-afro-indigo mb-2 tracking-tight">
        Afro<span className="text-afro-primary">Lingo</span>
      </h1>
      <div className="h-2 w-32 bg-kente-gradient rounded-full mb-6 mx-auto"></div>
      
      <p className="text-xl text-gray-700 max-w-md mb-12 font-medium">
        Learn Hausa, Yoruba, Igbo and more with AI-generated lessons and African art.
      </p>

      {!hasKey ? (
        <div className="w-full max-w-sm space-y-4">
             <button 
                onClick={handleRequestKey}
                className="group relative w-full py-4 bg-afro-dark text-white rounded-2xl font-bold text-lg uppercase tracking-wider border-b-4 border-black hover:bg-gray-800 active:border-b-0 active:translate-y-1 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">Connect AI Key</span>
              </button>
              <p className="text-xs text-gray-600 bg-white/50 py-1 px-3 rounded-full inline-block backdrop-blur-sm">
                Requires a Google Cloud Project with Gemini API enabled.
              </p>
        </div>
      ) : (
        <button 
          onClick={handleStart}
          className="kente-strip-bottom w-full max-w-sm py-5 bg-afro-primary text-white rounded-2xl font-bold text-xl uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden"
        >
          <span className="relative z-10 flex items-center">Get Started <ArrowRight size={24} className="ml-2" /></span>
        </button>
      )}
      
      <footer className="mt-16 text-sm text-afro-indigo/60 font-bold tracking-wide">
        Powered by Gemini 2.5 Flash Lite & 3 Pro
      </footer>
    </div>
  );
};

export default Welcome;
