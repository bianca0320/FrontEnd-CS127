// src/services/personMockService.ts
import { Person } from '../types';

// In-memory mock data
let people: Person[] = [];

// Helper to generate UUID (simple mock)


export const personMockService = {
  getAll: async (): Promise<Person[]> => {
    return [...people];
  },

  getById: async (id: string): Promise<Person | undefined> => {
    return people.find(p => p.personID.toString() === id);
  },

  create: async (person: Omit<Person, 'personID'>): Promise<Person> => {
    const newPerson: Person = {
      ...person,
      personID: Date.now(),
    };
    people.push(newPerson);
    return newPerson;
  },

  update: async (id: string, updates: Partial<Person>): Promise<Person | undefined> => {
    const idx = people.findIndex(p => p.personID.toString() === id);
    if (idx === -1) return undefined;
    people[idx] = { ...people[idx], ...updates };
    return people[idx];
  },

  delete: async (id: string): Promise<boolean> => {
    const idx = people.findIndex(p => p.personID.toString() === id);
    if (idx === -1) return false;
    people.splice(idx, 1);
    return true;
  },
};
