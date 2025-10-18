import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { format = 'csv' } = await request.json();

    if (!['csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      );
    }

    const mockPayments = [
      { familyName: 'Smith', learnerName: 'John Smith', amountDue: 8500, status: 'on-time' },
      { familyName: 'Johnson', learnerName: 'Emma Johnson', amountDue: 9200, status: 'overdue' }
    ];

    if (format === 'csv') {
      const csvContent = [
        'Family Name,Learner Name,Amount Due,Status,Due Date',
        ...mockPayments.map(p => 
          `"${p.familyName}","${p.learnerName}",${p.amountDue},${p.status},"2024-02-01"`
        )
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="payment-report.csv"',
        },
      });
    } else {
      const pdfContent = `Payment Report\nGenerated: ${new Date().toLocaleDateString()}`;
      
      return new NextResponse(pdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="payment-report.pdf"',
        },
      });
    }
  } catch (error) {
    console.error('Error exporting payments:', error);
    return NextResponse.json(
      { error: 'Failed to export payment report' },
      { status: 500 }
    );
  }
}