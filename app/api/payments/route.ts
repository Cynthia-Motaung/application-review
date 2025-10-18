import { NextRequest, NextResponse } from 'next/server';

const mockPayments = [
  {
    id: '1',
    familyName: 'Smith',
    learnerName: 'John Smith',
    grade: '5',
    amountDue: 8500,
    dueDate: '2024-02-05',
    status: 'on-time',
    paymentMethod: 'debit',
    contactEmail: 'sarah.smith@example.com',
    contactPhone: '+27 11 123 4567'
  },
  {
    id: '2',
    familyName: 'Johnson',
    learnerName: 'Emma Johnson',
    grade: '3',
    amountDue: 9200,
    dueDate: '2024-02-01',
    status: 'overdue',
    paymentMethod: 'eft',
    contactEmail: 'michael.johnson@example.com',
    contactPhone: '+27 11 234 5678',
    lastReminderSent: '2024-02-02'
  },
  {
    id: '3',
    familyName: 'Brown',
    learnerName: 'Liam Brown',
    grade: '7',
    amountDue: 7800,
    dueDate: '2024-02-10',
    status: 'pending',
    paymentMethod: 'card',
    contactEmail: 'jessica.brown@example.com',
    contactPhone: '+27 11 345 6789'
  },
  {
    id: '4',
    familyName: 'Davis',
    learnerName: 'Sophia Davis',
    grade: '2',
    amountDue: 8900,
    dueDate: '2024-01-25',
    status: 'overdue',
    paymentMethod: 'debit',
    contactEmail: 'david.davis@example.com',
    contactPhone: '+27 11 456 7890',
    lastReminderSent: '2024-01-28'
  },
  {
    id: '5',
    familyName: 'Wilson',
    learnerName: 'Noah Wilson',
    grade: '4',
    amountDue: 8100,
    dueDate: '2024-02-15',
    status: 'on-time',
    paymentMethod: 'eft',
    contactEmail: 'jennifer.wilson@example.com',
    contactPhone: '+27 11 567 8901'
  }
];

const mockMetrics = {
  totalOutstanding: 42500,
  collectedThisMonth: 125600,
  overduePayments: 16700,
  collectionRate: 85.5,
  totalFamilies: 5,
  onTimePayments: 2,
  pendingPayments: 1,
  overdueFamilies: 2
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status') || 'all';
    const grade = searchParams.get('grade') || 'all';
    const paymentMethod = searchParams.get('paymentMethod') || 'all';
    const search = searchParams.get('search') || '';

    let filteredPayments = mockPayments;

    if (status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }

    if (grade !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.grade === grade);
    }

    if (paymentMethod !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.paymentMethod === paymentMethod);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredPayments = filteredPayments.filter(payment =>
        payment.familyName.toLowerCase().includes(searchTerm) ||
        payment.learnerName.toLowerCase().includes(searchTerm)
      );
    }

    const filteredMetrics = {
      ...mockMetrics,
      totalFamilies: filteredPayments.length,
      onTimePayments: filteredPayments.filter(p => p.status === 'on-time').length,
      pendingPayments: filteredPayments.filter(p => p.status === 'pending').length,
      overdueFamilies: filteredPayments.filter(p => p.status === 'overdue').length,
      totalOutstanding: filteredPayments.reduce((sum, p) => sum + p.amountDue, 0),
      overduePayments: filteredPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amountDue, 0)
    };

    return NextResponse.json({
      metrics: filteredMetrics,
      payments: filteredPayments,
      total: filteredPayments.length
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment data' },
      { status: 500 }
    );
  }
}