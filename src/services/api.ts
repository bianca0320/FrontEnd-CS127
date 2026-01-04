/**
 * API Service - HTTP calls to Spring Boot backend
 * 
 * Base URL: Update this to match your Spring Boot server
 * Default: http://localhost:8080/api
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  // Handle empty responses (like DELETE)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

// Import types
import { Person, Group, Entry, Payment } from '../types'

// ============================================================================
// PEOPLE API
// ============================================================================

export const peopleApi = {
  getAll: async (): Promise<Person[]> => {
    return apiRequest<Person[]>('/persons')
  },

  getById: async (id: number): Promise<Person> => {
    return apiRequest<Person>(`/persons/${id}`)
  },

  create: async (person: Omit<Person, 'personID'>): Promise<Person> => {
    return apiRequest<Person>('/persons', {
      method: 'POST',
      body: JSON.stringify(person),
    })
  },

  update: async (id: number, person: Partial<Person>): Promise<Person> => {
    return apiRequest<Person>(`/persons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(person),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest<void>(`/persons/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============================================================================
// GROUPS API
// ============================================================================

export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    return apiRequest<Group[]>('/groups')
  },

  getById: async (id: number): Promise<Group> => {
    return apiRequest<Group>(`/groups/${id}`)
  },

  create: async (group: Omit<Group, 'groupID'>): Promise<Group> => {
    return apiRequest<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify(group),
    })
  },

  update: async (id: number, group: Partial<Group>): Promise<Group> => {
    return apiRequest<Group>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    })
  },

  delete: async (id: number): Promise<void> => {
    return apiRequest<void>(`/groups/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============================================================================
// ENTRIES API
// ============================================================================

export const entriesApi = {
  // Note: No "get all entries" endpoint provided
  // If you need this, add GET /api/entry to your backend
  // For now, returning empty array - you can fetch individual entries
  getAll: async (): Promise<Entry[]> => {
    console.warn('Get all entries endpoint not available. Returning empty array.')
    return []
  },

  getById: async (id: string): Promise<Entry> => {
    return apiRequest<Entry>(`/entry/${id}`)
  },

  // Create Straight Expense
  createStraight: async (entry: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>): Promise<Entry> => {
    return apiRequest<Entry>('/entry', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  },

  // Create Installment Expense
  createInstallment: async (entry: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>): Promise<Entry> => {
    return apiRequest<Entry>('/entry/installment', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  },

  // Generic create - determines type based on entry.transactionType
  create: async (entry: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>): Promise<Entry> => {
    if (entry.transactionType === 'Installment Expense') {
      return entriesApi.createInstallment(entry)
    } else {
      return entriesApi.createStraight(entry)
    }
  },

  update: async (id: string, entry: Partial<Entry>): Promise<Entry> => {
    return apiRequest<Entry>(`/entry/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    })
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/entry/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============================================================================
// PAYMENTS API
// ============================================================================

export const paymentsApi = {
  getAll: async (): Promise<Payment[]> => {
    return apiRequest<Payment[]>('/payments/all')
  },

  getById: async (paymentId: string): Promise<Payment> => {
    return apiRequest<Payment>(`/payments/${paymentId}`)
  },

  getByEntryId: async (entryId: string): Promise<Payment[]> => {
    return apiRequest<Payment[]>(`/payments/entry/${entryId}`)
  },

  getByPayeeId: async (payeeId: string): Promise<Payment[]> => {
    return apiRequest<Payment[]>(`/payments/by/${payeeId}`)
  },

  create: async (payment: Omit<Payment, 'id' | 'entryId' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
    return apiRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    })
  },

  update: async (paymentId: string, payment: Partial<Payment>): Promise<Payment> => {
    return apiRequest<Payment>(`/payments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify(payment),
    })
  },

  delete: async (paymentId: string): Promise<void> => {
    return apiRequest<void>(`/payments/${paymentId}`, {
      method: 'DELETE',
    })
  },
}
