import { ApplicationData } from '@/types/application';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export const applicationsApi = {
  async getApplication(id: number): Promise<ApplicationData> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async submitDecision(id: number, decision: string, notes: string): Promise<{ success: boolean; newStatus: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ decision, notes }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async exportApplication(id: number, format: 'csv' | 'pdf' = 'csv'): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (format === 'csv') {
      return response.blob();
    } else {
      return response.json();
    }
  }
};

const mockApplicationData: ApplicationData = {
  id: 12345,
  student: { 
    name: "Sarah Johnson", 
    grade: 8, 
    dob: "2010-03-15", 
    previousSchool: "Greenfield Primary" 
  },
  parent: { 
    name: "Michael Johnson", 
    email: "m.johnson@email.com", 
    phone: "+27 82 123 4567", 
    address: "123 Oak Street, Cape Town" 
  },
  creditRisk: "High",
  creditScore: 580,
  incomeRatio: 45,
  monthlyFee: 4500,
  disposableIncome: 10000,
  documents: [
    { name: "ID Document", status: "Verified", uploaded: "Oct 8, 2024" }, 
    { name: "Proof of Address", status: "Verified", uploaded: "Oct 8, 2024" },
    { name: "Bank Statement", status: "Under Review", uploaded: "Oct 8, 2024" },
    { name: "Payslip", status: "Verified", uploaded: "Oct 8, 2024" }
  ],
  timeline: [
    { event: "Application Submitted", timestamp: "2024-10-08T14:30:00Z" },
    { event: "Documents Uploaded", timestamp: "2024-10-08T15:15:00Z" },
    { event: "Credit Check Completed", timestamp: "2024-10-08T16:00:00Z" },
    { event: "Under Review", timestamp: "2024-10-08T16:30:00Z" }
  ],
  status: "Pending Review"
};

export const mockApplicationsApi = {
  async getApplication(id: number): Promise<ApplicationData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockApplicationData, id });
      }, 500);
    });
  },

  async submitDecision(id: number, decision: string, notes: string): Promise<{ success: boolean; newStatus: string; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
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

        resolve({ 
          success: true, 
          newStatus,
          message: `Application ${id} has been ${newStatus.toLowerCase()}`
        });
      }, 800);
    });
  },

  async exportApplication(id: number, format: 'csv' | 'pdf' = 'csv'): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (format === 'csv') {
          const csvContent = 'Mock CSV Content';
          const blob = new Blob([csvContent], { type: 'text/csv' });
          resolve(blob);
        } else {
          resolve({
            success: true,
            format: 'pdf',
            message: 'PDF export initiated',
            downloadUrl: `/api/applications/${id}/export/pdf?token=${Date.now()}`,
          });
        }
      }, 1000);
    });
  }
};

const isDevelopment = process.env.NODE_ENV === 'development';
export const api = isDevelopment ? mockApplicationsApi : applicationsApi;