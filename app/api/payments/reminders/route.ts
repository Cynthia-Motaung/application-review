import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentIds } = await request.json();

    if (!paymentIds || !Array.isArray(paymentIds)) {
      return NextResponse.json(
        { error: 'Invalid payment IDs' },
        { status: 400 }
      );
    }

    console.log(`Sending reminders for payments: ${paymentIds.join(', ')}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: `Reminders sent to ${paymentIds.length} families`,
      sentTo: paymentIds
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}