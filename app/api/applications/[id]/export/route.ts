import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { format = 'csv' } = await request.json();

    if (!['csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (format === 'csv') {
      const csvContent = [
        'Application ID,Student Name,Grade,Date of Birth,Previous School',
        `12345,"Sarah Johnson",8,2010-03-15,"Greenfield Primary"`,
        '',
        'Parent Name,Email,Phone,Address',
        `"Michael Johnson","m.johnson@email.com","+27 82 123 4567","123 Oak Street, Cape Town"`,
        '',
        'Risk Assessment,Credit Score,Income Ratio,Monthly Fee,Disposable Income,Status',
        `High,580,45,4500,10000,Pending Review`
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="application-${id}-export.csv"`,
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        format: 'pdf',
        message: 'PDF export initiated',
        downloadUrl: `/api/applications/${id}/export/pdf?token=${Date.now()}`,
      });
    }
  } catch (error) {
    console.error('Error generating export:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
}