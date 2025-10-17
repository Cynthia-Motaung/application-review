
import { NextRequest, NextResponse } from 'next/server';

// This would connect to your actual database
const mockApplications = [
  { id: 12345, studentName: 'John Smith', parentName: 'Sarah Smith', grade: '5', status: 'Pending Review', submittedDate: '2024-01-15', riskLevel: 'Medium' },
  { id: 12346, studentName: 'Emma Johnson', parentName: 'Michael Johnson', grade: '3', status: 'Approved', submittedDate: '2024-01-14', riskLevel: 'Low' },
  { id: 12347, studentName: 'Liam Brown', parentName: 'Jessica Brown', grade: '7', status: 'Awaiting Documents', submittedDate: '2024-01-13', riskLevel: 'High' },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let filteredApplications = mockApplications;

    if (status && status !== 'all') {
      filteredApplications = filteredApplications.filter(app => 
        app.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredApplications = filteredApplications.filter(app =>
        app.studentName.toLowerCase().includes(searchTerm) ||
        app.parentName.toLowerCase().includes(searchTerm) ||
        app.id.toString().includes(searchTerm)
      );
    }

    return NextResponse.json({
      applications: filteredApplications,
      total: filteredApplications.length,
      stats: {
        total: mockApplications.length,
        pending: mockApplications.filter(app => app.status === 'Pending Review').length,
        approved: mockApplications.filter(app => app.status === 'Approved').length,
        declined: mockApplications.filter(app => app.status === 'Declined').length,
        awaiting: mockApplications.filter(app => app.status === 'Awaiting Documents').length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
