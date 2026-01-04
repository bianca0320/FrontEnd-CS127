import { Entry, PaymentFrequency, InstallmentStatus, InstallmentTerm } from '../types';

let entries: Entry[] = [];

function uuid() {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}

// Helper function to calculate installment term due dates
function generateInstallmentTerms(
  startDate: Date,
  paymentFrequency: PaymentFrequency,
  paymentTerms: number,
  paymentAmountPerTerm: number
): InstallmentTerm[] {
  const terms: InstallmentTerm[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < paymentTerms; i++) {
    let dueDate = new Date(start);

    if (paymentFrequency === PaymentFrequency.MONTHLY) {
      dueDate.setMonth(start.getMonth() + i);
    } else if (paymentFrequency === PaymentFrequency.WEEKLY) {
      dueDate.setDate(start.getDate() + (i * 7));
    }

    // Normalize to start of day
    dueDate.setHours(0, 0, 0, 0);

    terms.push({
      termNumber: i + 1,
      dueDate,
      status: InstallmentStatus.NOT_STARTED,
      skipped: false,
      delinquent: false,
    });
  }

  return terms;
}

export const entryMockService = {
  getAll: async (): Promise<Entry[]> => {
    return [...entries];
  },

  getById: async (id: string): Promise<Entry | undefined> => {
    return entries.find(e => e.id === id);
  },

  create: async (entry: Omit<Entry, 'id' | 'referenceId' | 'createdAt' | 'updatedAt'>): Promise<Entry> => {
    // Auto-generate installment terms if installment details provided
    let installmentDetails = entry.installmentDetails;
    if (installmentDetails) {
      const terms = generateInstallmentTerms(
        new Date(installmentDetails.startDate),
        installmentDetails.paymentFrequency,
        installmentDetails.paymentTerms,
        installmentDetails.paymentAmountPerTerm
      );
      installmentDetails = {
        ...installmentDetails,
        id: uuid(),
        entryId: '', // Will be set below
        terms,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Initialize payment allocations with amountPaid = 0
    let paymentAllocations = entry.paymentAllocations;
    if (paymentAllocations && paymentAllocations.length > 0) {
      paymentAllocations = paymentAllocations.map(alloc => ({
        ...alloc,
        amountPaid: alloc.amountPaid || 0,
        id: alloc.id || uuid(),
        entryId: '', // Will be set below
        createdAt: alloc.createdAt || new Date(),
        updatedAt: alloc.updatedAt || new Date(),
      }));
    }

    const newEntry: Entry = {
      ...entry,
      status: entry.status || 'UNPAID',
      id: uuid(),
      referenceId: uuid(),
      installmentDetails: installmentDetails ? { ...installmentDetails, entryId: uuid() } : undefined,
      paymentAllocations,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    entries.push(newEntry);
    return newEntry;
  },

  update: async (id: string, updates: Partial<Entry>): Promise<Entry | undefined> => {
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    
    // If updating installment details, check if critical fields changed
    let finalUpdates = { ...updates };
    if (updates.installmentDetails && entries[idx].installmentDetails) {
      const existing = entries[idx].installmentDetails!;
      const incoming = updates.installmentDetails;
      
      // Check if critical fields changed (startDate, frequency, or number of terms)
      const startDateChanged = new Date(incoming.startDate).getTime() !== new Date(existing.startDate).getTime();
      const frequencyChanged = incoming.paymentFrequency !== existing.paymentFrequency;
      const termsCountChanged = incoming.paymentTerms !== existing.paymentTerms;
      
      if (startDateChanged || frequencyChanged || termsCountChanged) {
        // Regenerate terms because critical fields changed
        const terms = generateInstallmentTerms(
          new Date(incoming.startDate),
          incoming.paymentFrequency,
          incoming.paymentTerms,
          incoming.paymentAmountPerTerm
        );
        finalUpdates.installmentDetails = {
          ...incoming,
          id: existing.id,
          entryId: existing.entryId,
          terms,
          createdAt: existing.createdAt,
        };
      } else {
        // Preserve existing terms if only non-critical fields changed
        finalUpdates.installmentDetails = {
          ...incoming,
          terms: existing.terms,
          id: existing.id,
          entryId: existing.entryId,
          createdAt: existing.createdAt,
        };
      }
    } else if (updates.installmentDetails && !entries[idx].installmentDetails) {
      // Generate new terms if switching to installment type
      const terms = generateInstallmentTerms(
        new Date(updates.installmentDetails.startDate),
        updates.installmentDetails.paymentFrequency,
        updates.installmentDetails.paymentTerms,
        updates.installmentDetails.paymentAmountPerTerm
      );
      finalUpdates.installmentDetails = {
        ...updates.installmentDetails,
        id: uuid(),
        entryId: id,
        terms,
        createdAt: new Date(),
      };
    }
    
    entries[idx] = { ...entries[idx], ...finalUpdates, updatedAt: new Date() };
    return entries[idx];
  },

  delete: async (id: string): Promise<boolean> => {
    const idx = entries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    entries.splice(idx, 1);
    return true;
  },
};
