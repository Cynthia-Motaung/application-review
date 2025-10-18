import { NextRequest, NextResponse } from 'next/server';

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

    const mockApplicationData = {
      id: id,
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
    };

    if (format === 'csv') {
      const csvContent = [
        'Application ID,Student Name,Grade,Date of Birth,Previous School',
        `${mockApplicationData.id},"${mockApplicationData.student.name}",${mockApplicationData.student.grade},${mockApplicationData.student.dob},"${mockApplicationData.student.previousSchool}"`,
        '',
        'Parent Name,Email,Phone,Address',
        `"${mockApplicationData.parent.name}","${mockApplicationData.parent.email}","${mockApplicationData.parent.phone}","${mockApplicationData.parent.address}"`,
        '',
        'Risk Assessment,Credit Score,Income Ratio,Monthly Fee,Disposable Income,Status',
        `${mockApplicationData.creditRisk},${mockApplicationData.creditScore},${mockApplicationData.incomeRatio},${mockApplicationData.monthlyFee},${mockApplicationData.disposableIncome},${mockApplicationData.status}`
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="application-${id}-export.csv"`,
        },
      });
    } else {
      const pdfContent = `
        APPLICATION REVIEW REPORT
        ========================
        
        Application ID: ${id}
        Generated: ${new Date().toLocaleDateString('en-ZA')}
        
        STUDENT INFORMATION
        ------------------
        Name: ${mockApplicationData.student.name}
        Grade: ${mockApplicationData.student.grade}
        Date of Birth: ${mockApplicationData.student.dob}
        Previous School: ${mockApplicationData.student.previousSchool}
        
        PARENT INFORMATION
        -----------------
        Name: ${mockApplicationData.parent.name}
        Email: ${mockApplicationData.parent.email}
        Phone: ${mockApplicationData.parent.phone}
        Address: ${mockApplicationData.parent.address}
        
        FINANCIAL ASSESSMENT
        -------------------
        Credit Score: ${mockApplicationData.creditScore}
        Income Ratio: ${mockApplicationData.incomeRatio}%
        Monthly Fee: R${mockApplicationData.monthlyFee}
        Disposable Income: R${mockApplicationData.disposableIncome}
        Status: ${mockApplicationData.status}
      `;

      return new NextResponse(pdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="application-${id}-export.pdf"`,
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