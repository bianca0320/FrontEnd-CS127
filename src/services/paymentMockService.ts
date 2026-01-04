import { Payment, PaymentStatus } from '../types';
import { entryMockService } from './entryMockService';

let payments: Payment[] = [];

function uuid() {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}

export const paymentMockService = {
  getAll: async (): Promise<Payment[]> => {
    return [...payments];
  },

  getById: async (id: string): Promise<Payment | undefined> => {
    return payments.find(p => p.id === id);
  },

  getByEntryId: async (entryId: string): Promise<Payment[]> => {
    return payments.filter(p => p.entryId === entryId);
  },

  create: async (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
    const newPayment: Payment = {
      ...payment,
      id: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    payments.push(newPayment);

    // Update the related entry's amountRemaining and status
    if (payment.entryId) {
      const entry = await entryMockService.getById(payment.entryId);
      if (entry) {
        // Get all payments for this entry
        const allPayments = payments.filter(p => p.entryId === payment.entryId);
        const totalPaid = allPayments.reduce((sum, p) => sum + (p.paymentAmount || 0), 0);
        const amountRemaining = Math.max(0, entry.amountBorrowed - totalPaid);
        let status: PaymentStatus = PaymentStatus.UNPAID;
        if (amountRemaining === 0) status = PaymentStatus.PAID;
        else if (amountRemaining < entry.amountBorrowed) status = PaymentStatus.PARTIALLY_PAID;
        await entryMockService.update(entry.id, { amountRemaining, status });
      }
    }
    return newPayment;
  },

  update: async (id: string, updates: Partial<Payment>): Promise<Payment | undefined> => {
    const idx = payments.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    payments[idx] = { ...payments[idx], ...updates, updatedAt: new Date() };
    return payments[idx];
  },

  delete: async (id: string): Promise<boolean> => {
    const idx = payments.findIndex(p => p.id === id);
    if (idx === -1) return false;
    payments.splice(idx, 1);
    return true;
  },
};
