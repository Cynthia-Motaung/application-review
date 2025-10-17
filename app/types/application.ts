// types/application.ts
export interface StudentData {
  name: string;
  grade: number;
  dob: string;
  previousSchool: string;
}

export interface ParentData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Document {
  name: string;
  status: 'Verified' | 'Under Review' | 'Pending';
  uploaded: string;
}

export interface TimelineEvent {
  event: string;
  timestamp: string;
  note?: string;
}

export interface ApplicationData {
  id: number;
  student: StudentData;
  parent: ParentData;
  creditRisk: string;
  creditScore: number;
  incomeRatio: number;
  monthlyFee: number;
  disposableIncome: number;
  documents: Document[];
  timeline: TimelineEvent[];
  status: 'Pending Review' | 'Approved' | 'Declined' | 'Awaiting Documents';
  
  // Backward compatibility
  monthlySchoolFees?: number;
  monthlyDisposableIncome?: number;
  creditCheckStatus?: 'complete' | 'pending' | 'failed';
  incomeDocsStatus?: 'verified' | 'under_review' | 'missing' | 'failed';
}