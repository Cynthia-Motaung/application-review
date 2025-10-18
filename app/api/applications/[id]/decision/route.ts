import { NextRequest, NextResponse } from 'next/server';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'https://api.database-service.com';
const DATABASE_SERVICE_API_KEY = process.env.DATABASE_SERVICE_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { decision, notes } = await request.json();

    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    if (!decision || !['approve', 'request_documents', 'decline'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision type' },
        { status: 400 }
      );
    }

    // Map decision to status
    let newStatus: string;
    switch (decision) {
      case 'approve':
        newStatus = 'Approved';
        break;
      case 'request_documents':
        newStatus = 'Awaiting Documents';
        break;
      case 'decline':
        newStatus = 'Declined';
        break;
      default:
        newStatus = 'Pending Review';
    }

    // In a real implementation, update application in database
    console.log(`Updating application ${id} to status: ${newStatus}`);
    console.log(`Decision notes: ${notes}`);

    // Mock successful update
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      newStatus,
      message: `Application ${id} has been ${newStatus.toLowerCase()}`
    });
  } catch (error) {
    console.error('Error processing decision:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}