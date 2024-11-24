import { create } from 'zustand';
import { LogEntry } from '../types';

interface LogState {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  addLog: (logEntry) =>
    set((state) => ({
      logs: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          ...logEntry,
        },
        ...state.logs,
      ],
    })),
}));