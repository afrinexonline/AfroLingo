export interface Language {
  id: string;
  name: string;
  flag: string; // Emoji
  greeting: string;
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Challenge {
  id: number;
  type: 'vocabulary' | 'translation';
  question: string;
  imagePrompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  englishTranslation: string;
}

export interface Lesson {
  title: string;
  challenges: Challenge[];
}

export type ImageSize = '1K' | '2K' | '4K';

export interface UserState {
  hearts: number;
  xp: number;
  streak: number;
}