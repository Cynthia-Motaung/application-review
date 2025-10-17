import { ApplicationData } from '@/types/application';

// Mock data that matches the business logic requirements
const mockApplicationData: ApplicationData = {
  id: 12345,
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
  creditScore: 685, // Band C -> Amber
  monthlyFee: 8500,
  monthlySchoolFees: 8500,
  disposableIncome: 25000,
  monthlyDisposableIncome: 25000,
  creditRisk: 'Completed',
  incomeRatio: 34, // 34% -> Green (affordable)
  documents: [
    { name: 'ID Document', uploaded: '2024-01-10', status: 'Verified' },
    { name: 'Proof of Income', uploaded: '2024-01-10', status: 'Under Review' },
    { name: 'Bank Statements', uploaded: '2024-01-11', status: 'Under Review' },
    { name: 'Previous School Report', uploaded: '2024-01-09', status: 'Verified' }
  ],
  timeline: [
    { event: 'Application Submitted', timestamp: '2024-01-08T10:30:00Z' },
    { event: 'Documents Uploaded', timestamp: '2024-01-10T14:22:00Z' },
    { event: 'Credit Check Initiated', timestamp: '2024-01-11T09:15:00Z' },
    { event: 'Credit Check Completed', timestamp: '2024-01-12T11:45:00Z' },
    { event: 'Under Review', timestamp: '2024-01-12T13:20:00Z' }
  ]
};

const mockApplications = [
  { id: 12345, studentName: 'John Smith', parentName: 'Sarah Smith', grade: '5', status: 'Pending Review', submittedDate: '2024-01-15', riskLevel: 'Medium' },
  { id: 12346, studentName: 'Emma Johnson', parentName: 'Michael Johnson', grade: '3', status: 'Approved', submittedDate: '2024-01-14', riskLevel: 'Low' },
  { id: 12347, studentName: 'Liam Brown', parentName: 'Jessica Brown', grade: '7', status: 'Awaiting Documents', submittedDate: '2024-01-13', riskLevel: 'High' },
  { id: 12348, studentName: 'Sophia Davis', parentName: 'David Davis', grade: '2', status: 'Declined', submittedDate: '2024-01-12', riskLevel: 'High' },
  { id: 12349, studentName: 'Noah Wilson', parentName: 'Jennifer Wilson', grade: '4', status: 'Pending Review', submittedDate: '2024-01-11', riskLevel: 'Medium' },
];

// Application variants that match the business logic test cases
const applicationVariants = {
  // Test Case 1: Credit Amber (685), Income Green (34%) -> Pending Review + Conditional Approval
  12345: {
    creditScore: 685,  // Band C -> Amber
    monthlyFee: 8500,
    disposableIncome: 25000,
    incomeRatio: 34,   // 34% -> Green (affordable)
    creditRisk: 'Completed',
    incomeDocsStatus: 'under_review'
  },
  // Test Case 2: Credit Green (745), Income Green (26%) -> No badges + Approval Recommended
  12346: {
    creditScore: 745,  // Band A -> Green
    monthlyFee: 9200,
    disposableIncome: 35000,
    incomeRatio: 26,   // 26% -> Green (affordable)
    creditRisk: 'Completed',
    incomeDocsStatus: 'verified'
  },
  // Test Case 3: Credit Red (580), Income Amber (52%) -> Risk Flag + Pending Review + Review
  12347: {
    creditScore: 580,  // Band D -> Red
    monthlyFee: 7800,
    disposableIncome: 15000,
    incomeRatio: 52,   // 52% -> Red (over threshold)
    creditRisk: 'Completed',
    incomeDocsStatus: 'under_review'
  },
  // Test Case 4: Credit Red (520), Income Red (74%) -> Risk Flag + Decline – High Risk
  12348: {
    creditScore: 520,  // Band E -> Red
    monthlyFee: 8900,
    disposableIncome: 12000,
    incomeRatio: 74,   // 74% -> Red (over threshold)
    creditRisk: 'Completed',
    incomeDocsStatus: 'verified'
  },
  // Test Case 5: Credit Amber (625), Income Amber (37%) -> Pending Review + Review
  12349: {
    creditScore: 625,  // Band C -> Amber
    monthlyFee: 8100,
    disposableIncome: 22000,
    incomeRatio: 37,   // 37% -> Amber (tight)
    creditRisk: 'Completed',
    incomeDocsStatus: 'verified'
  },
  // Additional test cases to cover all scenarios
  12350: {
    creditScore: 700,  // Band B -> Green
    monthlyFee: 7500,
    disposableIncome: 18000,
    incomeRatio: 42,   // 42% -> Amber (tight)
    creditRisk: 'Completed',
    incomeDocsStatus: 'verified'
  },
  12351: {
    creditScore: undefined, // No score -> Grey
    monthlyFee: 8000,
    disposableIncome: 20000,
    incomeRatio: 40,   // 40% -> Amber
    creditRisk: 'pending',
    incomeDocsStatus: 'verified'
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getApplication(id: number): Promise<ApplicationData> {
    await delay(500); // Simulate network delay
    
    const appVariant = applicationVariants[id as keyof typeof applicationVariants] || applicationVariants[12345];
    const appInfo = mockApplications.find(app => app.id === id) || mockApplications[0];
    
    // Calculate the actual income ratio to ensure accuracy
    const calculatedIncomeRatio = Math.round((appVariant.monthlyFee / appVariant.disposableIncome) * 100);
    
    // Return mock data with the requested ID and variant data
    return {
      ...mockApplicationData,
      id: id,
      status: appInfo.status as any,
      student: {
        ...mockApplicationData.student,
        name: appInfo.studentName,
        grade: parseInt(appInfo.grade)
      },
      parent: {
        ...mockApplicationData.parent,
        name: appInfo.parentName
      },
      creditScore: appVariant.creditScore,
      monthlyFee: appVariant.monthlyFee,
      monthlySchoolFees: appVariant.monthlyFee,
      disposableIncome: appVariant.disposableIncome,
      monthlyDisposableIncome: appVariant.disposableIncome,
      incomeRatio: calculatedIncomeRatio, // Use calculated ratio for accuracy
      creditRisk: appVariant.creditRisk,
      documents: [
        { name: 'ID Document', uploaded: '2024-01-10', status: 'Verified' },
        { 
          name: 'Proof of Income', 
          uploaded: '2024-01-10', 
          status: appVariant.incomeDocsStatus === 'verified' ? 'Verified' : 'Under Review' 
        },
        { name: 'Bank Statements', uploaded: '2024-01-11', status: 'Under Review' },
        { name: 'Previous School Report', uploaded: '2024-01-09', status: 'Verified' },
        ...(id === 12347 ? [{ name: 'Additional Financial Docs', uploaded: '2024-01-12', status: 'Under Review' }] : [])
      ],
      timeline: [
        { event: 'Application Submitted', timestamp: '2024-01-08T10:30:00Z' },
        { event: 'Documents Uploaded', timestamp: '2024-01-10T14:22:00Z' },
        { event: 'Credit Check Initiated', timestamp: '2024-01-11T09:15:00Z' },
        ...(appVariant.creditRisk === 'Completed' ? 
          [{ event: 'Credit Check Completed', timestamp: '2024-01-12T11:45:00Z' }] : 
          [{ event: 'Credit Check Pending', timestamp: '2024-01-12T11:45:00Z' }]
        ),
        ...(id === 12346 ? [{ event: 'Decision: APPROVED', timestamp: '2024-01-13T14:30:00Z', note: 'Automatic approval - low risk' }] : []),
        ...(id === 12348 ? [{ event: 'Decision: DECLINED', timestamp: '2024-01-13T15:45:00Z', note: 'High risk - income ratio too high' }] : []),
        ...(id === 12347 ? [{ event: 'Additional Documents Requested', timestamp: '2024-01-13T16:20:00Z', note: 'Requested proof of additional income' }] : []),
        { event: 'Under Review', timestamp: '2024-01-12T13:20:00Z' }
      ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    };
  },

  async submitDecision(applicationId: number, decision: string, notes: string) {
    await delay(800); // Simulate processing time
    
    console.log(`Decision submitted for app ${applicationId}:`, { decision, notes });
    
    let newStatus = 'pending_review';
    if (decision === 'approve') newStatus = 'approved';
    else if (decision === 'decline') newStatus = 'declined';
    else if (decision === 'request_documents') newStatus = 'awaiting_documents';
    
    return {
      success: true,
      newStatus,
      message: `Application ${applicationId} has been ${decision.replace('_', ' ')}`
    };
  },

  async exportApplication(applicationId: number, format: 'pdf' | 'csv') {
    await delay(1000); // Simulate export processing
    
    console.log(`Exporting application ${applicationId} as ${format}`);
    
    const appVariant = applicationVariants[applicationId as keyof typeof applicationVariants] || applicationVariants[12345];
    const appInfo = mockApplications.find(app => app.id === applicationId) || mockApplications[0];
    const calculatedIncomeRatio = Math.round((appVariant.monthlyFee / appVariant.disposableIncome) * 100);
    
    // Determine credit band and color based on business logic
    let creditBand = 'N/A';
    let creditColor = 'grey';
    if (appVariant.creditScore) {
      if (appVariant.creditScore >= 720) { creditBand = 'A'; creditColor = 'green'; }
      else if (appVariant.creditScore >= 670) { creditBand = 'B'; creditColor = 'green'; }
      else if (appVariant.creditScore >= 610) { creditBand = 'C'; creditColor = 'amber'; }
      else if (appVariant.creditScore >= 550) { creditBand = 'D'; creditColor = 'red'; }
      else { creditBand = 'E'; creditColor = 'red'; }
    }
    
    // Determine income color based on business logic
    let incomeColor = 'grey';
    if (calculatedIncomeRatio <= 35) incomeColor = 'green';
    else if (calculatedIncomeRatio <= 50) incomeColor = 'amber';
    else incomeColor = 'red';
    
    // Create more realistic mock blob data
    let content = '';
    
    if (format === 'pdf') {
      content = `
        APPLICATION REVIEW REPORT
        =========================
        
        Application ID: ${applicationId}
        Generated: ${new Date().toLocaleDateString()}
        
        RISK ASSESSMENT SUMMARY:
        - Credit Score: ${appVariant.creditScore || 'Pending'} (Band ${creditBand}, ${creditColor})
        - Income Ratio: ${calculatedIncomeRatio}% (${incomeColor})
        - Monthly Fees: R${appVariant.monthlyFee}
        - Disposable Income: R${appVariant.disposableIncome}
        
        BUSINESS LOGIC VALIDATION:
        This mock data is designed to test all risk assessment scenarios.
        
        Student Information:
        - Name: ${appInfo.studentName}
        - Grade: ${appInfo.grade}
        - Status: ${appInfo.status}
      `;
    } else {
      // CSV format
      content = `Application ID,Student Name,Parent Name,Grade,Status,Credit Score,Credit Band,Credit Color,Monthly Fees,Disposable Income,Income Ratio,Income Color
${applicationId},${appInfo.studentName},${appInfo.parentName},${appInfo.grade},${appInfo.status},${appVariant.creditScore || 'N/A'},${creditBand},${creditColor},R${appVariant.monthlyFee},R${appVariant.disposableIncome},${calculatedIncomeRatio}%,${incomeColor}`;
    }
    
    const blob = new Blob([content], { 
      type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
    });
    
    return blob;
  },

  async getApplications() {
    await delay(300);
    return mockApplications;
  }
};
