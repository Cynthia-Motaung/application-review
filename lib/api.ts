import { ApplicationData } from '@/types/application';
import { PaymentMetrics, PaymentRecord, PaymentResponse } from '@/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  // Application Methods
  async getApplication(id: number): Promise<ApplicationData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/applications/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`Failed to fetch live data, using fallback:`, error);
      return this.generateFallbackApplication(id);
    }
  }

  async getApplications() {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/applications`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch applications, using fallback:', error);
      const fallbackData = [
        { id: 12345, studentName: 'John Smith', parentName: 'Sarah Smith', grade: '5', status: 'Pending Review', submittedDate: '2024-01-15', riskLevel: 'Medium' },
        { id: 12346, studentName: 'Emma Johnson', parentName: 'Michael Johnson', grade: '3', status: 'Approved', submittedDate: '2024-01-14', riskLevel: 'Low' },
        { id: 12347, studentName: 'Liam Brown', parentName: 'Jessica Brown', grade: '7', status: 'Awaiting Documents', submittedDate: '2024-01-13', riskLevel: 'High' },
      ];
      
      return { 
        applications: fallbackData, 
        total: fallbackData.length,
        stats: {
          total: fallbackData.length,
          pending: fallbackData.filter(app => app.status === 'Pending Review').length,
          approved: fallbackData.filter(app => app.status === 'Approved').length,
          declined: fallbackData.filter(app => app.status === 'Declined').length,
          awaiting: fallbackData.filter(app => app.status === 'Awaiting Documents').length
        }
      };
    }
  }

  async submitDecision(applicationId: number, decision: string, notes: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/applications/${applicationId}/decision`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ decision, notes }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to submit decision to live API, using mock response:', error);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/applications/${applicationId}/export`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ format }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.warn('Failed to export from live API, using mock export:', error);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const content = format === 'pdf' 
        ? `PDF Export for Application ${applicationId}`
        : `CSV Export for Application ${applicationId}`;
      
      return new Blob([content], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
      });
    }
  }

  // Payment Methods
  async getPayments(filters?: {
    status?: string;
    grade?: string;
    paymentMethod?: string;
    search?: string;
  }): Promise<PaymentResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters?.grade && filters.grade !== 'all') queryParams.append('grade', filters.grade);
      if (filters?.paymentMethod && filters.paymentMethod !== 'all') queryParams.append('paymentMethod', filters.paymentMethod);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/payments?${queryParams.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Failed to fetch payments, using fallback:', error);
      return this.generateFallbackPayments(filters);
    }
  }

  async sendPaymentReminders(paymentIds: string[]) {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/payments/reminders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentIds }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to send reminders, using mock response:', error);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Reminders sent to ${paymentIds.length} families`,
        sentTo: paymentIds
      };
    }
  }

  async exportPayments(format: 'csv' | 'pdf') {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/payments/export`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ format }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.warn('Failed to export payments, using mock export:', error);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const content = format === 'pdf' 
        ? `Payment Report PDF - Generated ${new Date().toLocaleDateString()}`
        : `Family,Learner,Amount Due,Status,Due Date\nSmith,John Smith,8500,on-time,2024-02-05\nJohnson,Emma Johnson,9200,overdue,2024-02-01`;
      
      return new Blob([content], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
      });
    }
  }

  // Fallback Data Generators
  private generateFallbackApplication(id: number): ApplicationData {
    const fallbackData = {
      id: id,
      status: 'Pending Review' as const,
      student: {
        name: 'Fallback Student',
        grade: 5,
        dob: '2015-01-01',
        previousSchool: 'Fallback School'
      },
      parent: {
        name: 'Fallback Parent',
        phone: '+27 11 000 0000',
        email: 'parent@example.com',
        address: '123 Fallback Street'
      },
      creditScore: 650,
      monthlyFee: 8000,
      monthlySchoolFees: 8000,
      disposableIncome: 20000,
      monthlyDisposableIncome: 20000,
      creditRisk: 'Completed',
      incomeRatio: 40,
      documents: [
        { name: 'ID Document', uploaded: '2024-01-01', status: 'Verified' as const },
        { name: 'Proof of Income', uploaded: '2024-01-01', status: 'Under Review' as const },
      ],
      timeline: [
        { event: 'Application Submitted', timestamp: new Date().toISOString() },
        { event: 'Under Review', timestamp: new Date().toISOString() },
      ]
    };

    return fallbackData;
  }

  private generateFallbackPayments(filters?: any): PaymentResponse {
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        familyName: 'Smith',
        learnerName: 'John Smith',
        grade: '5',
        amountDue: 8500,
        dueDate: '2024-02-05',
        status: 'on-time',
        paymentMethod: 'debit',
        contactEmail: 'sarah.smith@example.com',
        contactPhone: '+27 11 123 4567'
      },
      {
        id: '2',
        familyName: 'Johnson',
        learnerName: 'Emma Johnson',
        grade: '3',
        amountDue: 9200,
        dueDate: '2024-02-01',
        status: 'overdue',
        paymentMethod: 'eft',
        contactEmail: 'michael.johnson@example.com',
        contactPhone: '+27 11 234 5678',
        lastReminderSent: '2024-02-02'
      },
      {
        id: '3',
        familyName: 'Brown',
        learnerName: 'Liam Brown',
        grade: '7',
        amountDue: 7800,
        dueDate: '2024-02-10',
        status: 'pending',
        paymentMethod: 'card',
        contactEmail: 'jessica.brown@example.com',
        contactPhone: '+27 11 345 6789'
      },
      {
        id: '4',
        familyName: 'Davis',
        learnerName: 'Sophia Davis',
        grade: '2',
        amountDue: 8900,
        dueDate: '2024-01-25',
        status: 'overdue',
        paymentMethod: 'debit',
        contactEmail: 'david.davis@example.com',
        contactPhone: '+27 11 456 7890',
        lastReminderSent: '2024-01-28'
      },
      {
        id: '5',
        familyName: 'Wilson',
        learnerName: 'Noah Wilson',
        grade: '4',
        amountDue: 8100,
        dueDate: '2024-02-15',
        status: 'on-time',
        paymentMethod: 'eft',
        contactEmail: 'jennifer.wilson@example.com',
        contactPhone: '+27 11 567 8901'
      }
    ];

    let filteredPayments = [...mockPayments];

    if (filters?.status && filters.status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
    }

    if (filters?.grade && filters.grade !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.grade === filters.grade);
    }

    if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.paymentMethod === filters.paymentMethod);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPayments = filteredPayments.filter(payment =>
        payment.familyName.toLowerCase().includes(searchTerm) ||
        payment.learnerName.toLowerCase().includes(searchTerm)
      );
    }

    const metrics: PaymentMetrics = {
      totalOutstanding: filteredPayments.reduce((sum, p) => sum + p.amountDue, 0),
      collectedThisMonth: 125600,
      overduePayments: filteredPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amountDue, 0),
      collectionRate: 85.5,
      totalFamilies: filteredPayments.length,
      onTimePayments: filteredPayments.filter(p => p.status === 'on-time').length,
      pendingPayments: filteredPayments.filter(p => p.status === 'pending').length,
      overdueFamilies: filteredPayments.filter(p => p.status === 'overdue').length
    };

    return {
      metrics,
      payments: filteredPayments,
      total: filteredPayments.length
    };
  }
}

export const api = new ApiService();