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
}

export interface RiskBadge {
  type: string;
  status: 'High' | 'Medium' | 'Low' | 'Pending Review';
}

export interface CreditResult {
  color: string;
  copy: string;
  band: string | null;
  description: string;
  score?: number;
}

export interface IncomeResult {
  color: string;
  copy: string;
  ratioPct: number | null;
  description: string;
}

export interface DecisionRecommendation {
  copy: string;
  icon: React.ComponentType<any>;
  color: string;
}

export interface RiskData {
  creditResult: CreditResult;
  incomeResult: IncomeResult;
  decisionRecommendation: DecisionRecommendation;
  headerBadges: RiskBadge[];
}

