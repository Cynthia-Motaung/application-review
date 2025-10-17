// app/api/applications/[id]/export/route.ts
import { NextRequest, NextResponse } from 'next/server';

const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'https://api.database-service.com';
const DATABASE_SERVICE_API_KEY = process.env.DATABASE_SERVICE_API_KEY;

// Simple PDF content generator
const generateSimplePDF = (applicationData: any): string => {
  return `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 400 >>
stream
BT
/F1 12 Tf
50 750 Td (Application Review Summary) Tj
0 -20 Td (Application ID: ${applicationData.id}) Tj
0 -15 Td (Student: ${applicationData.student?.name || 'N/A'}) Tj
0 -15 Td (Grade: ${applicationData.student?.grade || 'N/A'}) Tj
0 -15 Td (Status: ${applicationData.status || 'N/A'}) Tj
0 -30 Td (Parent: ${applicationData.parent?.name || 'N/A'}) Tj
0 -15 Td (Email: ${applicationData.parent?.email || 'N/A'}) Tj
0 -15 Td (Phone: ${applicationData.parent?.phone || 'N/A'}) Tj
0 -30 Td (Financial Information:) Tj
0 -15 Td (Credit Score: ${applicationData.creditScore || 'N/A'}) Tj
0 -15 Td (Monthly Fee: R${applicationData.monthlyFee || applicationData.monthlySchoolFees || '0'}) Tj
0 -15 Td (Generated: ${new Date().toLocaleDateString('en-ZA')}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000254 00000 n 
0000000521 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
612
%%EOF
`.trim();
};

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

    // Fetch application data
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
      // Generate PDF directly
      const pdfContent = generateSimplePDF(applicationData);
      const pdfBuffer = Buffer.from(pdfContent);
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="application-${id}-export.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
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