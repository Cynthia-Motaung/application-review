import { ApplicationData } from '@/types/application';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export const applicationsApi = {
  async getApplication(id: number): Promise<ApplicationData> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      cache: 'no-store', // Ensure fresh data
    });
    
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

// Use live API in production, mock in development if needed
export const api = applicationsApi;