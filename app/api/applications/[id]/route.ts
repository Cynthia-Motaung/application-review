import { NextRequest, NextResponse } from 'next/server';

const mockApplicationData = {
  id: 12345,
  student: { 
    name: "Sarah Johnson", 
    grade: 8, 
    dob: "2010-03-15", 
    previousSchool: "Greenfield Primary" 
  },
  parent: { 
    name: "Michael Johnson", 
    email: "m.johnson@email.com", 
    phone: "+27 82 123 4567", 
    address: "123 Oak Street, Cape Town" 
  },
  creditRisk: "High",
  creditScore: 580,
  incomeRatio: 45,
  monthlyFee: 4500,
  disposableIncome: 10000,
  documents: [
    { name: "ID Document", status: "Verified", uploaded: "Oct 8, 2024" }, 
    { name: "Proof of Address", status: "Verified", uploaded: "Oct 8, 2024" },
    { name: "Bank Statement", status: "Under Review", uploaded: "Oct 8, 2024" },
    { name: "Payslip", status: "Verified", uploaded: "Oct 8, 2024" }
  ],
  timeline: [
    { event: "Application Submitted", timestamp: "2024-10-08T14:30:00Z" },
    { event: "Documents Uploaded", timestamp: "2024-10-08T15:15:00Z" },
    { event: "Credit Check Completed", timestamp: "2024-10-08T16:00:00Z" },
    { event: "Under Review", timestamp: "2024-10-08T16:30:00Z" }
  ],
  status: "Pending Review"
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (id !== 12345) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({ ...mockApplicationData, id });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}