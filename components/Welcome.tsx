
import React from 'react';
import { ArrowRight } from 'lucide-react';
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
        <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-500">
          {/* Sunburst effect behind */}
          <div className="absolute inset-0 bg-afro-gold rounded-full animate-pulse opacity-40 blur-2xl scale-125"></div>
          
          {/* Savanna Scene Container */}
          <div className="w-64 h-64 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-700 rounded-full flex items-end justify-center shadow-2xl border-[6px] border-afro-bg relative z-10 overflow-hidden isolate">
               
               {/* Sun */}
               <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-yellow-200 rounded-full blur-xl opacity-60"></div>

               {/* Background Landscape (Hills) */}
               <div className="absolute bottom-10 left-0 right-0 h-24 bg-orange-800/40 rounded-[100%] z-10 rotate-3 scale-110"></div>
               <div className="absolute -bottom-6 left-0 right-0 h-24 bg-green-800 rounded-[50%] z-20"></div>

               {/* Animals */}
               
               {/* Giraffe - Left Back */}
               <div className="absolute bottom-14 -left-2 text-6xl z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                  🦒
               </div>

               {/* Zebra - Right Back */}
               <div className="absolute bottom-14 -right-2 text-5xl z-10 animate-pulse" style={{ animationDuration: '4s' }}>
                  🦓
               </div>

               {/* Monkey - Hanging Top Right */}
               <div className="absolute top-6 right-8 text-4xl z-10 animate-bounce origin-top" style={{ animationDuration: '2.5s' }}>
                  🐒
               </div>

               {/* Lion - Center Front (King) */}
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-8xl z-30 drop-shadow-xl transform transition-transform hover:scale-110 duration-300">
                  🦁
               </div>
               
               {/* Birds */}
               <div className="absolute top-10 left-10 text-xs text-black/50 opacity-60">🕊️</div>
               <div className="absolute top-14 left-16 text-xs text-black/50 opacity-40">🕊️</div>

          </div>
          
          {/* Flag Badge */}
          <div className="absolute -bottom-2 -right-4 bg-afro-primary w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-50 rotate-12">
              <span className="text-4xl">🇳🇬</span>
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
