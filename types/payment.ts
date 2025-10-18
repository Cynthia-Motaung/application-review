export interface PaymentMetrics {
  totalOutstanding: number;
  collectedThisMonth: number;
  overduePayments: number;
  collectionRate: number;
  totalFamilies: number;
  onTimePayments: number;
  pendingPayments: number;
  overdueFamilies: number;
}

export interface PaymentRecord {
  id: string;
  familyName: string;
  learnerName: string;
  grade: string;
  amountDue: number;
  dueDate: string;
  status: 'on-time' | 'pending' | 'overdue';
  paymentMethod: 'debit' | 'eft' | 'card' | 'cash';
  contactEmail: string;
  contactPhone: string;
  lastReminderSent?: string;
}

export interface PaymentFilters {
  status: string;
  grade: string;
  paymentMethod: string;
  search: string;
}

export interface PaymentResponse {
  metrics: PaymentMetrics;
  payments: PaymentRecord[];
  total: number;
}