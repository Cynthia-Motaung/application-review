
import { ApplicationData } from '@/types/application';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Enhanced API service with live data and fallback
class ApiService {
  private async fetchWithFallback<T>(
    endpoint: string,
    fallbackData: T,
    options?: RequestInit
  ): Promise<T> {
    try {
      console.log(`Fetching from: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
        // Add timeout
        signal: AbortSignal.timeout(8000), // 8 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Live data fetched successfully:', data);
      return data;
    } catch (error) {
      console.warn(`Failed to fetch live data from ${endpoint}, using fallback:`, error);
      // Simulate network delay for consistency
      await new Promise(resolve => setTimeout(resolve, 300));
      return fallbackData;
    }
  }

  // Mock data that matches the business logic requirements
  private mockApplicationData: ApplicationData = {
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

  private mockApplications = [
    { id: 12345, studentName: 'John Smith', parentName: 'Sarah Smith', grade: '5', status: 'Pending Review', submittedDate: '2024-01-15', riskLevel: 'Medium' },
    { id: 12346, studentName: 'Emma Johnson', parentName: 'Michael Johnson', grade: '3', status: 'Approved', submittedDate: '2024-01-14', riskLevel: 'Low' },
    { id: 12347, studentName: 'Liam Brown', parentName: 'Jessica Brown', grade: '7', status: 'Awaiting Documents', submittedDate: '2024-01-13', riskLevel: 'High' },
    { id: 12348, studentName: 'Sophia Davis', parentName: 'David Davis', grade: '2', status: 'Declined', submittedDate: '2024-01-12', riskLevel: 'High' },
    { id: 12349, studentName: 'Noah Wilson', parentName: 'Jennifer Wilson', grade: '4', status: 'Pending Review', submittedDate: '2024-01-11', riskLevel: 'Medium' },
  ];

  // Application variants that match the business logic test cases
  private applicationVariants = {
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
    }
  };

  async getApplication(id: number): Promise<ApplicationData> {
    const fallbackData = this.generateMockApplication(id);
    
    return this.fetchWithFallback<ApplicationData>(
      `/applications/${id}`,
      fallbackData
    );
  }

  async getApplications() {
    const fallbackData = this.mockApplications;
    
    return this.fetchWithFallback(
      '/applications',
      { applications: fallbackData, total: fallbackData.length }
    );
  }

  async submitDecision(applicationId: number, decision: string, notes: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decision, notes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to submit decision to live API, using mock response:', error);
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let newStatus = 'pending_review';
      if (decision === 'approve') newStatus = 'approved';
      else if (decision === 'decline') newStatus = 'declined';
      else if (decision === 'request_documents') newStatus = 'awaiting_documents';
      
      return {
        success: true,
        newStatus,
        message: `Application ${applicationId} has been ${decision.replace('_', ' ')}`
      };
    }
  }

  async exportApplication(applicationId: number, format: 'pdf' | 'csv') {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.warn('Failed to export from live API, using mock export:', error);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock blob data
      const appVariant = this.applicationVariants[applicationId as keyof typeof this.applicationVariants] || this.applicationVariants[12345];
      const appInfo = this.mockApplications.find(app => app.id === applicationId) || this.mockApplications[0];
      
      let content = '';
      
      if (format === 'pdf') {
        content = `APPLICATION REVIEW REPORT\nApplication ID: ${applicationId}\nGenerated: ${new Date().toLocaleDateString()}`;
      } else {
        content = `Application ID,Student Name\n${applicationId},${appInfo.studentName}`;
      }
      
      return new Blob([content], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
      });
    }
  }

  private generateMockApplication(id: number): ApplicationData {
    const appVariant = this.applicationVariants[id as keyof typeof this.applicationVariants] || this.applicationVariants[12345];
    const appInfo = this.mockApplications.find(app => app.id === id) || this.mockApplications[0];
    const calculatedIncomeRatio = Math.round((appVariant.monthlyFee / appVariant.disposableIncome) * 100);
    
    return {
      ...this.mockApplicationData,
      id: id,
      status: appInfo.status as any,
      student: {
        ...this.mockApplicationData.student,
        name: appInfo.studentName,
        grade: parseInt(appInfo.grade)
      },
      parent: {
        ...this.mockApplicationData.parent,
        name: appInfo.parentName
      },
      creditScore: appVariant.creditScore,
      monthlyFee: appVariant.monthlyFee,
      monthlySchoolFees: appVariant.monthlyFee,
      disposableIncome: appVariant.disposableIncome,
      monthlyDisposableIncome: appVariant.disposableIncome,
      incomeRatio: calculatedIncomeRatio,
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
      ],
      timeline: [
        { event: 'Application Submitted', timestamp: '2024-01-08T10:30:00Z' },
        { event: 'Documents Uploaded', timestamp: '2024-01-10T14:22:00Z' },
        { event: 'Credit Check Initiated', timestamp: '2024-01-11T09:15:00Z' },
        ...(appVariant.creditRisk === 'Completed' ? 
          [{ event: 'Credit Check Completed', timestamp: '2024-01-12T11:45:00Z' }] : 
          [{ event: 'Credit Check Pending', timestamp: '2024-01-12T11:45:00Z' }]
        ),
        { event: 'Under Review', timestamp: '2024-01-12T13:20:00Z' }
      ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    };
  }
}

export const api = new ApiService();
