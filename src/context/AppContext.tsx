import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Entry, Person, Group, Payment } from '../types'
import { peopleApi, groupsApi, entriesApi, paymentsApi } from '../services/api'
import { personMockService } from '../services/personMockService'
import { groupMockService } from '../services/groupMockService'

interface AppContextType {
  // Data
  entries: Entry[]
  people: Person[]
  groups: Group[]
  
  // Loading states
  loading: boolean
  error: string | null
  
  // Entry operations
  addEntry: (entry: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateEntry: (id: string, entry: Partial<Entry>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  getEntry: (id: string) => Entry | undefined
  refreshEntries: () => Promise<void>
  
  // Person operations
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePerson: (id: string, person: Partial<Person>) => Promise<void>
  deletePerson: (id: string) => Promise<void>
  refreshPeople: () => Promise<void>
  
  // Group operations
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateGroup: (id: string, group: Partial<Group>) => Promise<void>
  deleteGroup: (id: string) => Promise<void>
  refreshGroups: () => Promise<void>
  addGroupMember: (groupID: string, personID: string) => Promise<void>
  removeGroupMember: (groupID: string, personID: string) => Promise<void>
  
  // Payment operations
  addPayment: (entryId: string, payment: Omit<Payment, 'id' | 'entryId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePayment: (entryId: string, paymentId: string, payment: Partial<Payment>) => Promise<void>
  deletePayment: (entryId: string, paymentId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial data on mount
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Note: No getAll endpoint for entries - entries loaded individually
      let peopleData: Person[] = []
      let groupsData: Group[] = []
      try {
        peopleData = await peopleApi.getAll()
      } catch (err) {
        // fallback to in-memory mock service when backend unavailable
        peopleData = await personMockService.getAll()
      }
      try {
        groupsData = await groupsApi.getAll()
      } catch (err) {
        groupsData = await groupMockService.getAll()
      }
      setPeople(peopleData)
      setGroups(groupsData)
      setEntries([]) // Entries loaded individually when needed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      console.error('Error loading initial data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Entry operations
  const refreshEntries = async () => {
    try {
      // Note: No getAll endpoint available, entries are loaded individually
      // This function is kept for consistency but won't do anything
      console.warn('refreshEntries: No getAll endpoint available. Entries loaded individually.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh entries')
      throw err
    }
  }

  const addEntry = async (entry: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newEntry = await entriesApi.create(entry)
      setEntries([...entries, newEntry])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create entry'
      setError(errorMessage)
      throw err
    }
  }

  const updateEntry = async (id: string, updatedEntry: Partial<Entry>) => {
    try {
      setError(null)
      const updated = await entriesApi.update(id, updatedEntry)
      setEntries(entries.map(entry => entry.id === id ? updated : entry))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update entry'
      setError(errorMessage)
      throw err
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      setError(null)
      await entriesApi.delete(id)
      setEntries(entries.filter(entry => entry.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete entry'
      setError(errorMessage)
      throw err
    }
  }

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id)
  }

  // Person operations
  const refreshPeople = async () => {
    try {
      try {
        const peopleData = await peopleApi.getAll()
        setPeople(peopleData)
      } catch (err) {
        const peopleData = await personMockService.getAll()
        setPeople(peopleData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh people')
      throw err
    }
  }

  const addPerson = async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newPerson = await peopleApi.create(person)
      setPeople([...people, newPerson])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create person'
      setError(errorMessage)
      throw err
    }
  }

  const updatePerson = async (id: string, updatedPerson: Partial<Person>) => {
    try {
      setError(null)
      const updated = await peopleApi.update(Number(id), updatedPerson)
      setPeople(people.map(person => person.personID.toString() === id ? updated : person))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update person'
      setError(errorMessage)
      throw err
    }
  }

  const deletePerson = async (id: string) => {
    try {
      setError(null)
      await peopleApi.delete(Number(id))
      setPeople(people.filter(person => person.personID.toString() !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete person'
      setError(errorMessage)
      throw err
    }
  }

  // Group operations
  const refreshGroups = async () => {
    try {
      try {
        const groupsData = await groupsApi.getAll()
        setGroups(groupsData)
      } catch (err) {
        const groupsData = await groupMockService.getAll()
        setGroups(groupsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh groups')
      throw err
    }
  }

  const addGroup = async (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newGroup = await groupsApi.create(group)
      setGroups([...groups, newGroup])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create group'
      setError(errorMessage)
      throw err
    }
  }

  const updateGroup = async (id: string, updatedGroup: Partial<Group>) => {
    try {
      setError(null)
      const updated = await groupsApi.update(Number(id), updatedGroup)
      setGroups(groups.map(group => group.groupID.toString() === id ? updated : group))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update group'
      setError(errorMessage)
      throw err
    }
  }

  const deleteGroup = async (id: string) => {
    try {
      setError(null)
      await groupsApi.delete(Number(id))
      setGroups(groups.filter(group => group.groupID.toString() !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete group'
      setError(errorMessage)
      throw err
    }
  }

  const addGroupMember = async (groupID: string, personID: string) => {
    try {
      setError(null)
      // Try backend API first, otherwise use mock service
      let updatedGroup: Group | undefined = undefined
      try {
        // groupsApi may not implement addMember on backend; use any to attempt
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updatedGroup = await (groupsApi as any).addMember(groupID, personID)
      } catch (err) {
        // fallback to in-memory mock
        const person = (await personMockService.getById(personID as any)) as Person | undefined
        if (person) {
          updatedGroup = await groupMockService.addMember(groupID, person) as Group | undefined
        }
      }
      if (updatedGroup) {
        setGroups(groups.map(group => group.groupID.toString() === groupID ? updatedGroup as any : group))
      } else {
        // As a safety, refresh groups
        await refreshGroups()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add group member'
      setError(errorMessage)
      throw err
    }
  }

  const removeGroupMember = async (groupID: string, personID: string) => {
    try {
      setError(null)
      try {
        // try backend
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await (groupsApi as any).removeMember(groupID, personID)
        const updatedGroup = await groupsApi.getById(Number(groupID))
        setGroups(groups.map(group => group.groupID.toString() === groupID ? updatedGroup : group))
      } catch (err) {
        // fallback to mock
        await groupMockService.removeMember(groupID, personID)
        const updatedGroup = await groupMockService.getById(groupID)
        setGroups(groups.map(group => group.groupID.toString() === groupID ? (updatedGroup as any) : group))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove group member'
      setError(errorMessage)
      throw err
    }
  }

  // Payment operations
  const addPayment = async (entryId: string, payment: Omit<Payment, 'id' | 'entryId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      // Payment API doesn't use entryId in path, but payment object should have entryId
      const paymentWithEntryId = { ...payment, entryId }
      await paymentsApi.create(paymentWithEntryId)
      // Refresh entries to get updated status and amountRemaining from backend
      // Note: Since getAll() returns empty, we'll need to refresh individual entry
      // For now, we'll try to refresh all (if endpoint exists) or update local state
      const entry = entries.find(e => e.id === entryId)
      if (entry) {
        // Fetch updated entry
        const updatedEntry = await entriesApi.getById(entryId)
        setEntries(entries.map(e => e.id === entryId ? updatedEntry : e))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment'
      setError(errorMessage)
      throw err
    }
  }

  const updatePayment = async (entryId: string, paymentId: string, updatedPayment: Partial<Payment>) => {
    try {
      setError(null)
      await paymentsApi.update(paymentId, updatedPayment)
      // Refresh the entry to get updated status from backend
      const entry = entries.find(e => e.id === entryId)
      if (entry) {
        const updatedEntry = await entriesApi.getById(entryId)
        setEntries(entries.map(e => e.id === entryId ? updatedEntry : e))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment'
      setError(errorMessage)
      throw err
    }
  }

  const deletePayment = async (entryId: string, paymentId: string) => {
    try {
      setError(null)
      await paymentsApi.delete(paymentId)
      // Refresh the entry to get updated status from backend
      const entry = entries.find(e => e.id === entryId)
      if (entry) {
        const updatedEntry = await entriesApi.getById(entryId)
        setEntries(entries.map(e => e.id === entryId ? updatedEntry : e))
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete payment'
      setError(errorMessage)
      throw err
    }
  }

  return (
    <AppContext.Provider
      value={{
        entries,
        people,
        groups,
        loading,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        refreshEntries,
        addPerson,
        updatePerson,
        deletePerson,
        refreshPeople,
        addGroup,
        updateGroup,
        deleteGroup,
        refreshGroups,
        addGroupMember,
        removeGroupMember,
        addPayment,
        updatePayment,
        deletePayment,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

