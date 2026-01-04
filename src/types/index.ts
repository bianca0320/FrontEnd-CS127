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
  proof?: Blob; // BLOB - photo/s showing the payment
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstallmentDetails {
  id: string; // UUID
  entryId: string;
  status: InstallmentStatus; // Not stored in DB
  startDate: Date; // YYMMDD format
  paymentFrequency: PaymentFrequency;
  paymentTerms: number; // Numeric
  paymentAmountPerTerm: number; // Decimal - auto computed
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
  lender: string; // Alphanumeric
  amountBorrowed: number; // Amount (Decimal)
  amountRemaining: number; // Amount (Decimal) - defaults to amountBorrowed
  status: PaymentStatus; // Alphanumeric - defaults to UNPAID
  notes?: string; // Alphanumeric, Optional
  paymentNotes?: string; // Alphanumeric, Optional
  receiptOrProofOfLoan?: Blob; // BLOB - Photo/s showing the loan
  referenceId: string; // Auto Generated Alphanumeric
  payments?: Payment[]; // List of payments made
  installmentDetails?: InstallmentDetails; // Only if transactionType is INSTALLMENT_EXPENSE
  paymentAllocations?: PaymentAllocation[]; // Only if borrower is a Group
  createdAt: Date;
  updatedAt: Date;
}

