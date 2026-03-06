import { SessionRecord } from '../types';

const HISTORY_PREFIX = 'aprendiendo_history_';

export const saveSession = (profileId: string, session: SessionRecord): void => {
    const key = `${HISTORY_PREFIX}${profileId}`;
    const existingHistory = getHistory(profileId);
    const updatedHistory = [session, ...existingHistory].slice(0, 50); // Keep last 50 sessions
    localStorage.setItem(key, JSON.stringify(updatedHistory));
};

export const getHistory = (profileId: string): SessionRecord[] => {
    const key = `${HISTORY_PREFIX}${profileId}`;
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error(`Error parsing history for profile ${profileId}:`, e);
        return [];
    }
};

export const deleteHistory = (profileId: string): void => {
    localStorage.removeItem(`${HISTORY_PREFIX}${profileId}`);
};
