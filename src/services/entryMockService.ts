import { Entry } from '../types';

let entries: Entry[] = [];

function uuid() {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}

export const entryMockService = {
  getAll: async (): Promise<Entry[]> => {
    return [...entries];
  },

  getById: async (id: string): Promise<Entry | undefined> => {
    return entries.find(e => e.id === id);
  },

  create: async (entry: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>): Promise<Entry> => {
    const newEntry: Entry = {
      ...entry,
      status: entry.status || 'UNPAID',
      id: uuid(),
      referenceId: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    entries.push(newEntry);
    return newEntry;
  },

  update: async (id: string, updates: Partial<Entry>): Promise<Entry | undefined> => {
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    entries[idx] = { ...entries[idx], ...updates, updatedAt: new Date() };
    return entries[idx];
  },

  delete: async (id: string): Promise<boolean> => {
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    entries.splice(idx, 1);
    return true;
  },
};
