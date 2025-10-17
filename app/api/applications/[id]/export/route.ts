import { NextRequest, NextResponse } from 'next/server';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'https://api.database-service.com';
const DATABASE_SERVICE_API_KEY = process.env.DATABASE_SERVICE_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { format = 'csv' } = await request.json();

    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    if (!['csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      );
    }

    // Fetch current application data for export
    const applicationResponse = await fetch(`${DATABASE_SERVICE_URL}/api/applications/${id}`, {
      headers: {
        'Authorization': `Bearer ${DATABASE_SERVICE_API_KEY}`,
      },
    });

    if (!applicationResponse.ok) {
      throw new Error('Failed to fetch application data for export');
    }

    const applicationData = await applicationResponse.json();

    if (format === 'csv') {
      const csvContent = [
        'Application ID,Student Name,Grade,Date of Birth,Previous School',
        `${applicationData.id},"${applicationData.student.name}",${applicationData.student.grade},${applicationData.student.dob},"${applicationData.student.previousSchool}"`,
        '',
        'Parent Name,Email,Phone,Address',
        `"${applicationData.parent.name}","${applicationData.parent.email}","${applicationData.parent.phone}","${applicationData.parent.address}"`,
        '',
        'Risk Assessment,Credit Score,Income Ratio,Monthly Fee,Disposable Income,Status',
        `${applicationData.creditRisk},${applicationData.creditScore},${applicationData.incomeRatio},${applicationData.monthlyFee},${applicationData.disposableIncome},${applicationData.status}`
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="application-${id}-export.csv"`,
        },
      });
    } else {
      // For PDF, you might use a service like Puppeteer or a PDF generation API
      const pdfServiceResponse = await fetch(`${DATABASE_SERVICE_URL}/api/applications/${id}/export/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DATABASE_SERVICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!pdfServiceResponse.ok) {
        throw new Error('PDF generation service unavailable');
      }

      const pdfResult = await pdfServiceResponse.json();

      return NextResponse.json({
        success: true,
        format: 'pdf',
        message: 'PDF export initiated',
        downloadUrl: pdfResult.downloadUrl,
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