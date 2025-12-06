import React from 'react';
import { UserState } from '../types';
import { Heart, Flame, Zap } from 'lucide-react';

interface UserProfileProps {
  userState: UserState;
}

const UserProfile: React.FC<UserProfileProps> = ({ userState }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-4">
      {/* Tribal/Fabric Label Style Container */}
      <div className="bg-white tribal-border rounded-xl p-3 shadow-lg flex items-center justify-between relative overflow-hidden">
        
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 bg-orange-50 opacity-30 pointer-events-none"></div>

        {/* Streak */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-100/50 transition-colors cursor-pointer group">
          <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-black text-orange-600 text-lg leading-none group-hover:scale-110 transition-transform origin-left">
              {userState.streak}
            </span>
            <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Streak</span>
          </div>
        </div>

        {/* XP */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-yellow-100/50 transition-colors cursor-pointer group">
          <Zap className="w-6 h-6 text-afro-gold fill-afro-gold" />
          <div className="flex flex-col">
            <span className="font-black text-yellow-600 text-lg leading-none group-hover:scale-110 transition-transform origin-left">
              {userState.xp}
            </span>
             <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider">XP</span>
          </div>
        </div>

        {/* Hearts */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-100/50 transition-colors cursor-pointer group">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
           <div className="flex flex-col">
            <span className="font-black text-red-600 text-lg leading-none group-hover:scale-110 transition-transform origin-left">
              {userState.hearts}
            </span>
            <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Lives</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
