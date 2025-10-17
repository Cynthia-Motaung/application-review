import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { decision, notes } = await request.json();

    if (!decision || !['approve', 'request_documents', 'decline'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision type' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));

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

    console.log(`Decision for application ${id}:`, { decision, notes, newStatus });

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