// For Installment entries, track each term's status
export interface InstallmentTerm {
  termNumber: number;
  dueDate: Date;
  status: InstallmentStatus;
  paymentDate?: Date;
  skipped?: boolean;
  delinquent?: boolean;
  notes?: string; // Editable notes for each term
}
// Enumerations
export enum TransactionType {
  STRAIGHT_EXPENSE = 'Straight Expense',
  INSTALLMENT_EXPENSE = 'Installment Expense',
  GROUP_EXPENSE = 'Group Expense',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
}

export enum InstallmentStatus {
  NOT_STARTED = 'NOT_STARTED',
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  SKIPPED = 'SKIPPED',
  DELINQUENT = 'DELINQUENT',
}

export enum PaymentAllocationStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
}

export enum PaymentFrequency {
  MONTHLY = 'Monthly',
  WEEKLY = 'Weekly',
}

// Core Types
export interface Person {
  personID: number;
  firstName: string;
  lastName: string;
  contact: string;
}

export interface Group {
  groupID: number;
  groupName: string;
}

export interface Payment {
  id: string; // UUID
  entryId: string;
  paymentDate: Date; // YYMMDD format
  paymentAmount: number; // Decimal
  payee: Person;
  termNumber?: number; // For installment entries - which term this payment is for
  proof?: Blob; // BLOB - photo/s showing the payment
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstallmentDetails {
  id: string; // UUID
  entryId: string;
  startDate: Date; // YYMMDD format
  paymentFrequency: PaymentFrequency;
  paymentTerms: number; // Numeric
  paymentAmountPerTerm: number; // Decimal - auto computed
  terms: InstallmentTerm[]; // Per-term status
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentAllocation {
  id: string; // UUID
  entryId: string;
  description: string; // Item name or share by person
  payee: Person;
  amount: number; // Numeric
  amountPaid: number; // Amount paid towards this allocation
  percentageOfTotal: number; // Not stored in DB
  status: PaymentAllocationStatus; // Not stored in DB
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Entry {
  id: string; // Auto Generated UUID
  entryName: string; // Alphanumeric
  description?: string; // Alphanumeric, Optional
  transactionType: TransactionType; // Alphanumeric
  dateBorrowed?: Date; // Date (YYMMDD), Optional
  dateFullyPaid?: Date; // Date (YYMMDD), Optional
  borrower: Person | Group; // Alphanumeric - can be group
  lender: Person; // Person who lent the money
  amountBorrowed: number; // Amount (Decimal)
  amountRemaining: number; // Amount (Decimal) - defaults to amountBorrowed
  status: PaymentStatus; // Alphanumeric - defaults to UNPAID
  notes?: string; // Alphanumeric, Optional
  paymentNotes?: string; // Alphanumeric, Optional
  proofOfLoan?: Blob; // BLOB - Photo/s showing the payment (e.g. EWallet screenshot), editable anytime, optional
  referenceId: string; // Auto Generated Alphanumeric
  payments?: Payment[]; // List of payments made
  installmentDetails?: InstallmentDetails; // Only if transactionType is INSTALLMENT_EXPENSE
  paymentAllocations?: PaymentAllocation[]; // Only if borrower is a Group
  createdAt: Date;
  updatedAt: Date;
}

