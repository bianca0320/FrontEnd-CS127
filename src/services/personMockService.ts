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
    
    // Check if person is a lender in any unpaid or partially paid entry
    const { entryMockService } = await import('./entryMockService');
    const allEntries = await entryMockService.getAll();
    const isLenderInActiveEntry = allEntries.some(entry => {
      if (entry.lender && typeof entry.lender === 'object' && 'personID' in entry.lender) {
        // Only prevent deletion if entry is not fully paid
        return entry.lender.personID.toString() === id && entry.status !== 'PAID';
      }
      return false;
    });
    
    if (isLenderInActiveEntry) {
      throw new Error('Cannot delete this person. They are a lender in one or more unpaid entries. Please ensure all entries are fully paid before deleting.');
    }
    
    // Check if person is a member of a group that has unpaid or partially paid entries
    const { groupMockService } = await import('./groupMockService');
    const allGroups = await groupMockService.getAll();
    
    for (const group of allGroups) {
      if ((group as any).members) {
        const isMember = (group as any).members.some((m: any) => m.personID.toString() === id);
        if (isMember) {
          // Check if this group is a borrower in any unpaid/partially paid entry
          const hasUnpaidGroupEntry = allEntries.some(entry => {
            if (entry.borrower && typeof entry.borrower === 'object' && 'groupID' in entry.borrower) {
              return entry.borrower.groupID.toString() === group.groupID.toString() && entry.status !== 'PAID';
            }
            return false;
          });
          
          if (hasUnpaidGroupEntry) {
            throw new Error(`Cannot delete this person. They are a member of "${group.groupName}" which has unpaid group expenses. Please ensure all group entries are fully paid before deleting.`);
          }
        }
      }
    }
    
    // Remove person from all groups before deleting
    for (const group of allGroups) {
      if ((group as any).members) {
        const hasMember = (group as any).members.some((m: any) => m.personID.toString() === id);
        if (hasMember) {
          await groupMockService.removeMember(group.groupID.toString(), id);
        }
      }
    }
    
    people.splice(idx, 1);
    return true;
  },
};
