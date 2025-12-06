import { UserState } from '../types';

const STORAGE_KEY = 'afrolingo_user_state';

const DEFAULT_STATE: UserState = {
  hearts: 5,
  xp: 0,
  streak: 0,
};

export const getUserState = (): UserState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_STATE;
  } catch (e) {
    console.error("Failed to load user state", e);
    return DEFAULT_STATE;
  }
};

export const saveUserState = (state: UserState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save user state", e);
  }
};
