import { NextRequest, NextResponse } from 'next/server';

// Enhanced mock data with variants for different test cases
const applicationVariants = {
  12345: {
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
  },
  12346: {
    id: 12346,
    status: 'Approved',
    student: {
      name: 'Emma Johnson',
      grade: 3,
      dob: '2018-07-22',
      previousSchool: 'Little Learners Academy'
    },
    parent: {
      name: 'Michael Johnson',
      phone: '+27 11 234 5678',
      email: 'michael.johnson@example.com',
      address: '456 Oak Avenue, Pretoria, 0001'
    },
    creditScore: 745,
    monthlyFee: 9200,
    monthlySchoolFees: 9200,
    disposableIncome: 35000,
    monthlyDisposableIncome: 35000,
    creditRisk: 'Completed',
    incomeRatio: 26,
    documents: [
      { name: 'ID Document', uploaded: '2024-01-09', status: 'Verified' },
      { name: 'Proof of Income', uploaded: '2024-01-09', status: 'Verified' },
      { name: 'Bank Statements', uploaded: '2024-01-09', status: 'Verified' },
      { name: 'Previous School Report', uploaded: '2024-01-08', status: 'Verified' }
    ],
    timeline: [
      { event: 'Application Submitted', timestamp: '2024-01-07T09:15:00Z' },
      { event: 'Documents Uploaded', timestamp: '2024-01-09T11:30:00Z' },
      { event: 'Credit Check Initiated', timestamp: '2024-01-09T14:20:00Z' },
      { event: 'Credit Check Completed', timestamp: '2024-01-10T10:45:00Z' },
      { event: 'Approved', timestamp: '2024-01-11T16:00:00Z' }
    ]
  },
  12347: {
    id: 12347,
    status: 'Awaiting Documents',
    student: {
      name: 'Liam Brown',
      grade: 7,
      dob: '2013-11-30',
      previousSchool: 'Maplewood Middle School'
    },
    parent: {
      name: 'Jessica Brown',
      phone: '+27 11 345 6789',
      email: 'jessica.brown@example.com',
      address: '789 Pine Road, Durban, 4000'
    },
    creditScore: 580,
    monthlyFee: 7800,
    monthlySchoolFees: 7800,
    disposableIncome: 15000,
    monthlyDisposableIncome: 15000,
    creditRisk: 'Completed',
    incomeRatio: 52,
    documents: [
      { name: 'ID Document', uploaded: '2024-01-11', status: 'Verified' },
      { name: 'Proof of Income', uploaded: '2024-01-12', status: 'Pending' },
      { name: 'Bank Statements', uploaded: '2024-01-11', status: 'Under Review' },
      { name: 'Previous School Report', uploaded: '2024-01-10', status: 'Verified' }
    ],
    timeline: [
      { event: 'Application Submitted', timestamp: '2024-01-10T13:45:00Z' },
      { event: 'Documents Uploaded', timestamp: '2024-01-11T15:20:00Z' },
      { event: 'Credit Check Initiated', timestamp: '2024-01-12T08:30:00Z' },
      { event: 'Credit Check Completed', timestamp: '2024-01-12T14:15:00Z' },
      { event: 'Additional Documents Requested', timestamp: '2024-01-13T09:00:00Z' }
    ]
  }
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

    // Get application data from mock database
    const applicationData = applicationVariants[id as keyof typeof applicationVariants];
    
    if (!applicationData) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const application = {
      ...applicationData,
      _metadata: {
        source: 'live',
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}