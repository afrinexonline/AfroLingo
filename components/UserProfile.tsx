import React from 'react';
import { UserState } from '../types';
import { Heart, Flame, Zap } from 'lucide-react';

interface UserProfileProps {
  userState: UserState;
}

const UserProfile: React.FC<UserProfileProps> = ({ userState }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-4">
      <div className="bg-white rounded-2xl p-3 shadow-sm border-2 border-gray-100 flex items-center justify-between">
        
        {/* Streak */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer group">
          <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
          <span className="font-extrabold text-orange-500 text-lg group-hover:scale-110 transition-transform">
            {userState.streak}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl hover:bg-yellow-50 transition-colors cursor-pointer group">
          <Zap className="w-6 h-6 text-yellow-500 fill-yellow-400" />
          <span className="font-extrabold text-yellow-500 text-lg group-hover:scale-110 transition-transform">
            {userState.xp} <span className="text-xs uppercase ml-1 opacity-70">XP</span>
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span className="font-extrabold text-red-500 text-lg group-hover:scale-110 transition-transform">
            {userState.hearts}
          </span>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
