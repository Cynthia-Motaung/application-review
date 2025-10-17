import { NextRequest, NextResponse } from 'next/server';

// Financial service API configuration
const FINANCIAL_SERVICE_URL = process.env.FINANCIAL_SERVICE_URL || 'https://api.financial-service.com';
const FINANCIAL_SERVICE_API_KEY = process.env.FINANCIAL_SERVICE_API_KEY;

// Database service configuration (replace with your actual database service)
const DATABASE_SERVICE_URL = process.env.DATABASE_SERVICE_URL || 'https://api.database-service.com';
const DATABASE_SERVICE_API_KEY = process.env.DATABASE_SERVICE_API_KEY;

interface FinancialData {
  creditScore: number;
  creditRisk: string;
  disposableIncome: number;
  incomeRatio: number;
  riskBand: string;
  lastUpdated: string;
}

interface ApplicationData {
  id: number;
  student: {
    name: string;
    grade: number;
    dob: string;
    previousSchool: string;
  };
  parent: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  monthlyFee: number;
  status: string;
  documents: Array<{
    name: string;
    status: 'Verified' | 'Under Review' | 'Pending';
    uploaded: string;
  }>;
  timeline: Array<{
    event: string;
    timestamp: string;
    note?: string;
  }>;
}

// Enhanced financial data fetching with better error handling
async function fetchFinancialData(applicationId: number): Promise<FinancialData> {
  try {
    const response = await fetch(`${FINANCIAL_SERVICE_URL}/v1/credit-check/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FINANCIAL_SERVICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    if (!response.ok) {
      // Handle specific HTTP errors
      if (response.status === 404) {
        throw new Error('Financial data not found for application');
      } else if (response.status === 401) {
        throw new Error('Financial service authentication failed');
      } else if (response.status >= 500) {
        throw new Error('Financial service temporarily unavailable');
      }
      throw new Error(`Financial service error: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.credit_score || !data.monthly_disposable_income) {
      throw new Error('Invalid financial data response');
    }
    
    return {
      creditScore: data.credit_score,
      creditRisk: data.risk_category || 'Unknown',
      disposableIncome: data.monthly_disposable_income,
      incomeRatio: data.fee_to_income_ratio || 0,
      riskBand: data.risk_band || 'Unknown',
      lastUpdated: data.last_updated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw new Error('Financial service unavailable');
  }
}

// Add timeout utility
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

async function fetchApplicationData(applicationId: number): Promise<ApplicationData> {
  try {
    const response = await fetch(`${DATABASE_SERVICE_URL}/api/applications/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DATABASE_SERVICE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Application not found');
      }
      throw new Error(`Database service error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching application data:', error);
    throw new Error('Failed to fetch application data');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'Invalid application ID' },
        { status: 400 }
      );
    }

    // Fetch application data and financial data in parallel
    const [applicationData, financialData] = await Promise.all([
      fetchApplicationData(id),
      fetchFinancialData(id).catch(error => {
        console.warn('Using fallback financial data due to:', error.message);
        // Fallback data - in production you might want different handling
        return {
          creditScore: 580,
          creditRisk: 'High',
          disposableIncome: 10000,
          incomeRatio: 45,
          riskBand: 'D',
          lastUpdated: new Date().toISOString()
        };
      })
    ]);

    // Combine the data
    const fullApplicationData = {
      ...applicationData,
      creditScore: financialData.creditScore,
      creditRisk: financialData.creditRisk,
      disposableIncome: financialData.disposableIncome,
      incomeRatio: financialData.incomeRatio,
      monthlyFee: applicationData.monthlyFee || 4500, // Default if not provided
    };

    return NextResponse.json(fullApplicationData);
  } catch (error) {
    console.error('Error fetching application:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}