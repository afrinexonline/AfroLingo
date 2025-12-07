import React, { useState, useEffect } from 'react';
import { Challenge, Lesson, ImageSize, Language, UserState, DifficultyLevel } from '../types';
import { generateLessonContent, generateChallengeImage } from '../services/geminiService';
import { CheckCircle2, XCircle, Heart, Loader2, Settings, RefreshCcw } from 'lucide-react';
import { playSound } from '../services/soundService';
import LessonComplete from './LessonComplete';

interface LessonScreenProps {
  language: Language;
  difficulty: DifficultyLevel;
  onExit: () => void;
  userState: UserState;
  updateUser: (newState: UserState) => void;
}

const BACKGROUND_ANIMALS = [
  { emoji: '🦁', animation: 'animate-bounce', name: 'Simba' },
  { emoji: '🐗', animation: 'animate-pulse', name: 'Pumbaa' },
  { emoji: '🐒', animation: 'animate-bounce', name: 'Rafiki' },
  { emoji: '🦓', animation: 'animate-pulse', name: 'Zebra' },
  { emoji: '🦒', animation: 'animate-bounce', name: 'Giraffe' },
  { emoji: '🐘', animation: 'animate-pulse', name: 'Elephant' },
];

// Helper to shuffle array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const LessonScreen: React.FC<LessonScreenProps> = ({ language, difficulty, onExit, userState, updateUser }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  // Background Animal State
  const [bgAnimal, setBgAnimal] = useState(BACKGROUND_ANIMALS[0]);
  
  // Lesson Lifecycle
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [lessonCount, setLessonCount] = useState(0);
  
  // Settings
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [showSettings, setShowSettings] = useState(false);

  // Initialize Lesson
  useEffect(() => {
    const initLesson = async () => {
      try {
        setLoading(true);
        const data = await generateLessonContent(language.name, difficulty);
        setLesson(data);
      } catch (e) {
        console.error(e);
        // Fallback or retry logic could go here
      } finally {
        setLoading(false);
      }
    };
    initLesson();
  }, [language, difficulty, lessonCount]);

  // Rotate Background Animal
  useEffect(() => {
    const randomAnimal = BACKGROUND_ANIMALS[Math.floor(Math.random() * BACKGROUND_ANIMALS.length)];
    setBgAnimal(randomAnimal);
  }, [currentChallengeIndex, isLessonComplete]);

  // Fetch Image when challenge changes
  useEffect(() => {
    if (!lesson) return;
    const challenge = lesson.challenges[currentChallengeIndex];
    if (!challenge) return;

    const fetchImage = async () => {
      setImageLoading(true);
      setCurrentImage(null); // Clear previous image
      try {
        const imgData = await generateChallengeImage(challenge.imagePrompt, imageSize);
        setCurrentImage(imgData);
      } catch (e) {
        console.error("Failed to load image", e);
      } finally {
        setImageLoading(false);
      }
    };

    fetchImage();
  }, [currentChallengeIndex, lesson, imageSize]);

  const handleSelectOption = (option: string) => {
    if (isChecked) return; // Prevent changing when checked
    playSound('click');
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || !lesson) return;
    const challenge = lesson.challenges[currentChallengeIndex];
    const correct = selectedOption === challenge.correctAnswer;
    
    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      playSound('correct');
    } else {
      playSound('incorrect');
      // Decrease hearts globally
      const newHearts = Math.max(0, userState.hearts - 1);
      updateUser({ ...userState, hearts: newHearts });

      // SRS Logic: Push incorrect question to the end of the queue
      setLesson((prevLesson) => {
        if (!prevLesson) return null;
        
        // Clone the current challenge
        const retryChallenge: Challenge = {
          ...challenge,
          id: Date.now(), // New ID to ensure uniqueness in keys
          isRetry: true, // Mark as a review item
          options: shuffleArray(challenge.options) // Shuffle options so user can't memorize position
        };

        return {
          ...prevLesson,
          challenges: [...prevLesson.challenges, retryChallenge]
        };
      });
    }
  };

  const handleNext = () => {
    if (!lesson) return;
    
    // Play simple click for transition unless it's the end
    if (currentChallengeIndex < lesson.challenges.length - 1) {
      playSound('click');
      setCurrentChallengeIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      // Lesson Complete logic
      const xpGain = 15;
      updateUser({
        ...userState,
        xp: userState.xp + xpGain,
        streak: userState.streak + 1
      });
      setIsLessonComplete(true);
    }
  };

  const handleContinue = () => {
    // Reset state for next lesson
    setIsLessonComplete(false);
    setLesson(null);
    setCurrentChallengeIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setCurrentImage(null);
    setLessonCount(prev => prev + 1); // Trigger re-fetch
  };

  const handleExit = () => {
    playSound('click');
    onExit();
  };

  const toggleSettings = () => {
    playSound('click');
    setShowSettings(!showSettings);
  };

  const handleImageSizeChange = (size: ImageSize) => {
    playSound('click');
    setImageSize(size);
  };

  if (isLessonComplete) {
    return (
      <div className="flex flex-col h-screen max-w-lg mx-auto bg-afro-pattern relative border-x-4 border-afro-bg overflow-hidden shadow-2xl rounded-2xl">
         {/* Background Animal for Completion Screen */}
         <div className={`absolute -bottom-10 -right-10 text-[10rem] opacity-10 pointer-events-none select-none z-0 ${bgAnimal.animation}`} style={{ animationDuration: '4s' }}>
            {bgAnimal.emoji}
         </div>
         
         <LessonComplete 
            xpGained={15} 
            totalStreak={userState.streak} 
            onContinue={handleContinue} 
            onExit={handleExit} 
         />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-afro-pattern p-6 text-center">
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-afro-gold rounded-full blur-xl opacity-50 animate-pulse"></div>
            <Loader2 className="w-20 h-20 text-afro-primary animate-spin relative z-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-afro-indigo mb-2">Consulting the ancestors...</h2>
        <p className="text-afro-terracotta font-semibold">Generating a {difficulty.toLowerCase()} lesson for {language.name}</p>
      </div>
    );
  }

  if (!lesson) return <div className="p-10 text-center">Failed to load lesson. <button onClick={handleExit} className="underline text-red-500">Go back</button></div>;

  const currentChallenge = lesson.challenges[currentChallengeIndex];
  // Progress bar calculation based on current index vs total length (which grows on error)
  const progress = ((currentChallengeIndex + (isChecked && isCorrect ? 1 : 0)) / lesson.challenges.length) * 100;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white sm:shadow-2xl sm:rounded-2xl overflow-hidden relative border-x-4 border-afro-bg">
      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border-b-8 border-afro-indigo">
            <h3 className="text-xl font-black text-afro-indigo mb-4 uppercase tracking-wide">Settings</h3>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Image Quality (Nano Banana Pro)</label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => handleImageSizeChange(size)}
                    className={`flex-1 py-3 px-3 rounded-xl border-2 font-bold text-sm transition-all ${
                      imageSize === size 
                        ? 'border-afro-primary bg-green-50 text-afro-primary' 
                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 font-semibold">Higher quality images take longer to generate.</p>
            </div>
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-4 bg-afro-indigo text-white rounded-xl font-bold uppercase tracking-wider hover:bg-slate-700 shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 flex items-center gap-4 bg-white shadow-sm z-20 relative">
        <button onClick={handleExit} className="text-gray-400 hover:text-red-500 transition-colors">
          <XCircle size={28} />
        </button>
        <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
          <div 
            className="h-full bg-afro-primary bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20"></div>
          </div>
        </div>
        <div className="flex items-center text-red-500 font-black bg-red-50 px-3 py-1 rounded-full">
          <Heart className={`fill-current mr-2 ${userState.hearts === 0 ? 'animate-bounce' : ''}`} size={20} />
          {userState.hearts}
        </div>
        <button onClick={toggleSettings} className="text-gray-400 hover:text-afro-indigo">
          <Settings size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-32 bg-slate-50 relative overflow-hidden">
        
        {/* Animated Background Animal */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] opacity-5 pointer-events-none select-none z-0 ${bgAnimal.animation} transition-all duration-1000`}
          style={{ animationDuration: '3s' }}
        >
          {bgAnimal.emoji}
        </div>

        {/* Challenge Content */}
        <div className="relative z-10">
          <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white bg-afro-terracotta px-2 py-1 rounded-md uppercase tracking-widest">{difficulty}</span>
                <span className="text-[10px] font-black text-white bg-afro-indigo px-2 py-1 rounded-md uppercase tracking-widest">{lesson.challenges[currentChallengeIndex].type}</span>
              </div>
              
              {/* SRS Indicator */}
              {currentChallenge.isRetry && (
                <div className="flex items-center gap-1 text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-in slide-in-from-right-5 fade-in">
                  <RefreshCcw size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Previous Mistake</span>
                </div>
              )}
          </div>
          
          <h2 className="text-2xl font-black text-gray-800 mb-6 leading-tight">
            {currentChallenge.question}
          </h2>

          {/* Frame for Image */}
          <div className="w-full aspect-square max-h-64 mb-8 rounded-xl overflow-hidden bg-afro-bg flex items-center justify-center border-[8px] border-afro-wood shadow-xl relative group">
            {imageLoading ? (
               <div className="absolute inset-0 z-10 bg-afro-bg flex flex-col items-center justify-center overflow-hidden">
                 {/* Sun Rising Animation */}
                 <div className="relative w-32 h-16 overflow-hidden mb-2">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-t from-red-600 to-yellow-400 rounded-full animate-[sun-rise_2s_infinite_ease-in-out]"></div>
                 </div>
                 <div className="w-40 h-1 bg-afro-wood rounded-full mb-3 relative z-10"></div>
                 <span className="text-xs font-black text-afro-terracotta uppercase tracking-widest animate-pulse">Weaving Visuals...</span>
                 <style>{`
                    @keyframes sun-rise {
                        0% { transform: translate(-50%, 100%); opacity: 0; }
                        50% { transform: translate(-50%, 10%); opacity: 1; }
                        100% { transform: translate(-50%, 10%); opacity: 1; }
                    }
                 `}</style>
               </div>
            ) : currentImage ? (
              <img 
                src={currentImage} 
                alt="Challenge Visual" 
                className="w-full h-full object-cover animate-in fade-in duration-500" 
              />
            ) : (
              <span className="text-xs text-gray-400">Image unavailable</span>
            )}
            
            {/* Tag */}
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-bold border border-white/20">
              {imageSize}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentChallenge.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === currentChallenge.correctAnswer;
              
              let statusClass = "border-gray-300 bg-white hover:bg-gray-50 border-b-4 active:border-b-2 active:translate-y-[2px] text-gray-700";
              
              if (isChecked) {
                if (isSelected && isCorrectOption) {
                  statusClass = "border-afro-primary bg-green-100 text-green-800 border-b-4";
                } else if (isSelected && !isCorrectOption) {
                  statusClass = "border-red-500 bg-red-50 text-red-600 border-b-4";
                } else if (isCorrectOption) {
                  statusClass = "border-afro-primary bg-green-50 text-green-700 border-b-4"; // Show correct answer
                } else {
                  statusClass = "border-gray-200 opacity-50 border-b-4 text-gray-400";
                }
              } else if (isSelected) {
                statusClass = "border-blue-400 bg-blue-50 text-blue-600 border-b-4 active:border-b-2";
              }

              return (
                <button
                  key={idx}
                  disabled={isChecked}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-2xl text-lg text-left font-bold transition-all shadow-sm ${statusClass}`}
                >
                  <div className="flex items-center justify-between">
                    {option}
                    {isChecked && isSelected && isCorrectOption && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                    {isChecked && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className={`p-4 border-t-2 absolute bottom-0 left-0 right-0 z-20 ${isChecked ? (isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200') : 'bg-white border-gray-100'}`}>
        {isChecked ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
            <div className="flex-1 text-center sm:text-left">
              <div className={`text-xl font-black mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Excellent!' : 'Incorrect'}
              </div>
              {!isCorrect && (
                <div className="text-red-600 font-bold mb-1">
                  Correct: {currentChallenge.correctAnswer}
                </div>
              )}
              <div className="text-sm text-gray-600 font-medium leading-tight">
                {currentChallenge.explanation}
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-white border-b-4 active:border-b-0 active:translate-y-1 transition-all shadow-lg ${isCorrect ? 'bg-afro-primary border-green-700 hover:bg-green-500' : 'bg-red-500 border-red-700 hover:bg-red-400'}`}
            >
              Continue
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-white border-b-4 transition-all shadow-md ${
              selectedOption 
                ? 'bg-afro-primary border-green-700 hover:bg-green-500 active:border-b-0 active:translate-y-1 cursor-pointer' 
                : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonScreen;