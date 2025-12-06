
import React, { useState, useEffect } from 'react';
import { Challenge, Lesson, ImageSize, Language, UserState, DifficultyLevel } from '../types';
import { generateLessonContent, generateChallengeImage } from '../services/geminiService';
import { CheckCircle2, XCircle, Heart, Loader2, Settings } from 'lucide-react';
import { playSound } from '../services/soundService';

interface LessonScreenProps {
  language: Language;
  difficulty: DifficultyLevel;
  onExit: () => void;
  userState: UserState;
  updateUser: (newState: UserState) => void;
}

const LessonScreen: React.FC<LessonScreenProps> = ({ language, difficulty, onExit, userState, updateUser }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  
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
  }, [language, difficulty]);

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
      // Lesson Complete
      playSound('complete');
      // Update XP and Streak
      // +15 XP for finishing, +1 Streak
      updateUser({
        ...userState,
        xp: userState.xp + 15,
        streak: userState.streak + 1
      });
      onExit();
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-afro-bg p-6 text-center">
        <Loader2 className="w-16 h-16 text-afro-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-afro-indigo">Consulting the ancestors...</h2>
        <p className="text-gray-500">Generating a {difficulty.toLowerCase()} lesson for {language.name}</p>
      </div>
    );
  }

  if (!lesson) return <div className="p-10 text-center">Failed to load lesson. <button onClick={handleExit} className="underline text-red-500">Go back</button></div>;

  const currentChallenge = lesson.challenges[currentChallengeIndex];
  const progress = ((currentChallengeIndex + (isChecked && isCorrect ? 1 : 0)) / lesson.challenges.length) * 100;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white sm:shadow-xl sm:rounded-xl overflow-hidden relative">
      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Settings</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image Quality (Nano Banana Pro)</label>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map(size => (
                  <button
                    key={size}
                    onClick={() => handleImageSizeChange(size)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 font-bold text-sm ${
                      imageSize === size 
                        ? 'border-afro-primary bg-green-50 text-afro-primary' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Higher quality images take longer to generate.</p>
            </div>
            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-3 bg-afro-primary text-white rounded-xl font-bold uppercase tracking-wider hover:bg-green-600"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={handleExit} className="text-gray-400 hover:text-gray-600">
          <XCircle size={28} />
        </button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-afro-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center text-red-500 font-bold">
          <Heart className={`fill-current mr-1 ${userState.hearts === 0 ? 'animate-bounce' : ''}`} size={24} />
          {userState.hearts}
        </div>
        <button onClick={toggleSettings} className="text-gray-400 hover:text-afro-indigo">
          <Settings size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{difficulty} Level</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentChallenge.question}
        </h2>

        {/* Dynamic Image Area */}
        <div className="w-full aspect-square max-h-64 mb-6 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-100 relative group">
          {imageLoading ? (
            <div className="flex flex-col items-center animate-pulse">
               <Loader2 className="w-10 h-10 text-gray-300 animate-spin mb-2" />
               <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Drawing...</span>
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
          <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-bold">
            {imageSize}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentChallenge.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentChallenge.correctAnswer;
            
            let statusClass = "border-gray-200 hover:bg-gray-50 border-b-4 active:border-b-2 active:translate-y-[2px]";
            
            if (isChecked) {
              if (isSelected && isCorrectOption) {
                statusClass = "border-afro-primary bg-green-100 text-afro-primary border-b-4";
              } else if (isSelected && !isCorrectOption) {
                statusClass = "border-red-500 bg-red-50 text-red-500 border-b-4";
              } else if (isCorrectOption) {
                 statusClass = "border-afro-primary bg-green-50 text-afro-primary border-b-4"; // Show correct answer
              } else {
                 statusClass = "border-gray-200 opacity-50 border-b-4";
              }
            } else if (isSelected) {
              statusClass = "border-blue-400 bg-blue-50 text-blue-500 border-b-4 active:border-b-2";
            }

            return (
              <button
                key={idx}
                disabled={isChecked}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-xl text-lg border-2 text-left font-bold transition-all ${statusClass}`}
              >
                <div className="flex items-center justify-between">
                  {option}
                  {isChecked && isSelected && isCorrectOption && <CheckCircle2 className="w-6 h-6" />}
                  {isChecked && isSelected && !isCorrectOption && <XCircle className="w-6 h-6" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className={`p-4 border-t-2 ${isChecked ? (isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200') : 'bg-white border-gray-100'}`}>
        {isChecked ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
            <div className="flex-1">
              <div className={`text-xl font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Excellent!' : 'Correct solution:'}
              </div>
              {!isCorrect && (
                <div className="text-red-600 font-semibold mb-1">
                  {currentChallenge.correctAnswer}
                </div>
              )}
              <div className="text-sm text-gray-600">
                {currentChallenge.explanation}
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-white border-b-4 active:border-b-0 active:translate-y-1 transition-all ${isCorrect ? 'bg-afro-primary border-green-600 hover:bg-green-500' : 'bg-red-500 border-red-700 hover:bg-red-400'}`}
            >
              Continue
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-white border-b-4 transition-all ${
              selectedOption 
                ? 'bg-afro-primary border-green-600 hover:bg-green-500 active:border-b-0 active:translate-y-1 cursor-pointer' 
                : 'bg-gray-300 border-gray-400 cursor-not-allowed'
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
