import { create } from 'zustand';
import { parseScheduleText } from '../utils/parser';

export interface Slot {
  day: string;
  start: string;
  end: string;
  type: string;
  className?: string;
}

const defaultText = localStorage.getItem('edt') || `
Lundi : C 08:00-09:00 ; R 10:00-10:10 ; C 10:10-14:30 ; C 14:30-16:00
Mardi : C 08:00-09:00 ; R 10:00-10:10 ; C 10:10-14:30
`;

interface ScheduleState {
  slots: Slot[];
  text: string;
  setFromText: (text: string) => void;
}

export const useScheduleStore = create<ScheduleState>(set => ({
  slots: parseScheduleText(defaultText),
  text: defaultText,
  setFromText: (text) => {
    const parsed = parseScheduleText(text);
    localStorage.setItem('edt', text);
    set({ slots: parsed, text });
  },
}));