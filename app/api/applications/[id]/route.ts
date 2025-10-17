
import { NextRequest, NextResponse } from 'next/server';

const mockApplicationData = {
  id: 12345,
  status: 'Pending Review',
  student: {
    name: 'John Smith',
    grade: 5,
    dob: '2015-03-15',
    previousSchool: 'Sunrise Elementary School'
  },
  parent: {
    name: 'Sarah Smith',
    phone: '+27 11 123 4567',
    email: 'sarah.smith@example.com',
    address: '123 Main Street, Johannesburg, 2000'
  },
  creditScore: 685,
  monthlyFee: 8500,
  monthlySchoolFees: 8500,
  disposableIncome: 25000,
  monthlyDisposableIncome: 25000,
  creditRisk: 'Completed',
  incomeRatio: 34,
  documents: [
    { name: 'ID Document', uploaded: '2024-01-10', status: 'Verified' },
    { name: 'Proof of Income', uploaded: '2024-01-10', status: 'Under Review' },
    { name: 'Bank Statements', uploaded: '2024-01-11', status: 'Under Review' },
    { name: 'Previous School Report', uploaded: '2024-01-09', status: 'Verified' }
  ],
  timeline: [
    { event: 'Application Submitted', timestamp: '2024-01-08T10:30:00Z' },
    { event: 'Documents Uploaded', timestamp: '2024-01-10T14:22:00Z' },
    { event: 'Credit Check Initiated', timestamp: '2024-01-11T09:15:00Z' },
    { event: 'Credit Check Completed', timestamp: '2024-01-12T11:45:00Z' },
    { event: 'Under Review', timestamp: '2024-01-12T13:20:00Z' }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    // In a real application, you would fetch from your database here
    const application = {
      ...mockApplicationData,
      id: id,
      _metadata: {
        source: 'live',
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}
