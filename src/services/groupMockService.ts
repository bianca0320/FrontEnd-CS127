import { Group, Person } from '../types';

// Extend Group type locally to always include members
type GroupWithMembers = Group & { members: Person[] };
let groups: GroupWithMembers[] = [];

export const groupMockService = {
  getAll: async (): Promise<Group[]> => {
    return [...groups];
  },

  getById: async (id: string): Promise<Group | undefined> => {
    return groups.find(g => g.groupID.toString() === id);
  },

  create: async (group: Omit<Group, 'groupID'> & { members?: Person[] }): Promise<Group & { members: Person[] }> => {
    const newGroup: Group & { members: Person[] } = {
      ...group,
      groupID: Date.now(),
      members: group.members || [],
    };
    groups.push(newGroup);
    return newGroup;
  },

  update: async (id: string, updates: Partial<Group>): Promise<Group | undefined> => {
    const idx = groups.findIndex(g => g.groupID.toString() === id);
          return groups.find(g => g.groupID.toString() === id) as GroupWithMembers | undefined;
    groups[idx] = { ...groups[idx], ...updates };
    return groups[idx];
  },

  delete: async (id: string): Promise<boolean> => {
    const idx = groups.findIndex(g => g.groupID.toString() === id);
    if (idx === -1) return false;
    groups.splice(idx, 1);
    return true;
  },

  addMember: async (groupId: string, person: Person): Promise<Group | undefined> => {
    const group = groups.find(g => g.groupID.toString() === groupId);
    if (!group) return undefined;
    if (!group.members) group.members = [];
    if (!group.members.find((m: Person) => m.personID === person.personID)) {
      group.members.push(person);
    }
    return group;
  },

  removeMember: async (groupId: string, personId: string): Promise<Group | undefined> => {
    const group = groups.find(g => g.groupID.toString() === groupId);
    if (!group) return undefined;
    if (!group.members) group.members = [];
    group.members = group.members.filter((m: Person) => m.personID.toString() !== personId);
    return group;
  },
};
