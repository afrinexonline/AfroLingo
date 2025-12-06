import React, { useEffect } from 'react';
import { Trophy, Flame, Zap, ArrowRight, Home } from 'lucide-react';
import { playSound } from '../services/soundService';

interface LessonCompleteProps {
  xpGained: number;
  totalStreak: number;
  onContinue: () => void;
  onExit: () => void;
}

const LessonComplete: React.FC<LessonCompleteProps> = ({ xpGained, totalStreak, onContinue, onExit }) => {
  
  useEffect(() => {
    playSound('complete');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in zoom-in-95 duration-500 relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-afro-gold max-w-sm w-full">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
           <div className="w-24 h-24 bg-afro-gold rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
              <Trophy size={48} className="text-white fill-white" />
           </div>
        </div>

        <div className="mt-10 mb-6">
          <h2 className="text-3xl font-extrabold text-afro-indigo mb-2">Lesson Complete!</h2>
          <p className="text-gray-600 font-medium">You're making great progress.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm">
             <Zap className="w-8 h-8 text-afro-gold fill-afro-gold mb-2" />
             <span className="text-2xl font-black text-afro-dark">+{xpGained}</span>
             <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">XP Gained</span>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm">
             <Flame className="w-8 h-8 text-orange-500 fill-orange-500 mb-2" />
             <span className="text-2xl font-black text-afro-dark">{totalStreak}</span>
             <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Day Streak</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => { playSound('click'); onContinue(); }}
            className="w-full py-4 bg-afro-primary text-white rounded-xl font-bold text-lg uppercase tracking-wider shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 group"
          >
            Next Lesson <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => { playSound('click'); onExit(); }}
            className="w-full py-4 bg-white text-afro-indigo rounded-xl font-bold text-lg uppercase tracking-wider border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            Dashboard <Home size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonComplete;