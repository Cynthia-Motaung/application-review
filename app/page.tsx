"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShieldAlert, DollarSign, User, Users, FileText, CheckCircle, Clock, XCircle,
  Menu, Bell, Search, Printer, FileTextIcon, ListOrdered, ChevronRight, Check,
  Home, Mail, Phone, Calendar, School, CheckCircle2, Eye, Download, AlertCircle, Loader2,
  LayoutDashboard, CreditCard, FolderOpen, LineChart, Settings
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { 
  StudentData, 
  ParentData, 
  Document, 
  TimelineEvent, 
  ApplicationData, 
  RiskBadge, 
  CreditResult, 
  IncomeResult, 
  DecisionRecommendation, 
  RiskData 
} from '@/types/application';

// --- MOCK API DATA & BOILERPLATE ---

// Mock Application Data with all required inputs
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
    
    // Required Input Fields
    creditScore: 580,
    monthlySchoolFees: 4500,
    monthlyDisposableIncome: 10000,
    creditCheckStatus: "complete",
    incomeDocsStatus: "verified",
    
    documents: [
        { name: "ID Document.pdf", status: "Verified", uploaded: "Oct 8, 2024" }, 
        { name: "Proof of Address.png", status: "Verified", uploaded: "Oct 8, 2024" },
        { name: "Bank Statement.pdf", status: "Under Review", uploaded: "Oct 8, 2024" },
        { name: "Payslip.pdf", status: "Verified", uploaded: "Oct 8, 2024" }
    ],
    timeline: [
        { event: "Application Submitted", timestamp: "2024-10-08T14:30:00Z" },
        { event: "Documents Uploaded", timestamp: "2024-10-08T15:15:00Z" },
        { event: "Credit Check Completed", timestamp: "2024-10-08T16:00:00Z", note: "Initial risk calculated" },
        { event: "Under Review", timestamp: "2024-10-08T16:30:00Z" }
    ],
    status: "Pending Review"
};

// Mock API Call functions
const fetchData = async (id: number): Promise<ApplicationData> => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`[API] Fetching application ${id}...`);
            resolve({ ...mockApplicationData, id });
        }, 500);
    });
};

const postDecision = async (id: number, decision: string, notes: string): Promise<{ success: boolean; newStatus: string }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`[API] Posting decision for ${id}: ${decision} with notes: "${notes}"`);
            resolve({ success: true, newStatus: decision === 'request_documents' ? 'Awaiting Documents' : decision });
        }, 800);
    });
};

// --- CORE BUSINESS LOGIC HOOK (Steps 2, 3, 4, 5) ---

const getColorClasses = (color: string) => {
    switch (color) {
        case 'green':
            return { bg: 'bg-green-50 text-green-700 border-green-200', pill: 'bg-green-100 text-green-700' };
        case 'amber':
            return { bg: 'bg-yellow-50 text-yellow-700 border-yellow-200', pill: 'bg-yellow-100 text-yellow-700' };
        case 'red':
            return { bg: 'bg-red-50 text-red-700 border-red-200', pill: 'bg-red-100 text-red-700' };
        case 'grey':
            return { bg: 'bg-gray-50 text-gray-700 border-gray-200', pill: 'bg-gray-200 text-gray-600' };
        default:
            return { bg: 'bg-gray-50 text-gray-700 border-gray-200', pill: 'bg-gray-200 text-gray-600' };
    }
};

// STEP 5: Decision Recommendation Logic
const getDecisionRecommendation = (creditColor: string, incomeColor: string): DecisionRecommendation => {
    if (creditColor === "grey" || incomeColor === "grey") 
        return { copy: 'Review', icon: ListOrdered, color: 'amber' };

    if (creditColor === "red" && incomeColor === "red") 
        return { copy: "Decline – High Risk", icon: XCircle, color: 'red' };
    
    // Red + Amber / Amber + Red
    if ((creditColor === "amber" && incomeColor === "red") || (creditColor === "red" && incomeColor === "amber")) 
        return { copy: "Review", icon: ListOrdered, color: 'amber' };
    
    if (creditColor === "amber" && incomeColor === "amber") 
        return { copy: "Review", icon: ListOrdered, color: 'amber' };
    
    if (creditColor === "green" && incomeColor === "amber") 
        return { copy: "Conditional Approval", icon: CheckCircle, color: 'green' };
    
    if (creditColor === "green" && incomeColor === "green") 
        return { copy: "Approval Recommended", icon: Check, color: 'green' };

    return { copy: "Review", icon: ListOrdered, color: 'amber' };
};

const useRiskAssessment = (data: Partial<ApplicationData>): RiskData => {
    const { creditScore, monthlySchoolFees, monthlyDisposableIncome, creditCheckStatus, incomeDocsStatus } = data;

    // STEP 2: Credit Risk Logic
    const creditResult = useMemo((): CreditResult => {
        // Overrides (Order matters: pending > failed > calculation)
        if (creditCheckStatus === "pending" || creditScore === null || creditScore === undefined) {
            return { color: 'grey', copy: 'Pending...', band: null, description: 'Credit check pending.' };
        }
        if (creditCheckStatus === "failed") {
            return { color: 'red', copy: 'High', band: 'F', description: 'Credit check failed.' };
        }

        // STEP 2: Credit Score → Band → Color Mapping
        let band, description, color, copy;
        
        if (creditScore >= 720) { 
            band = 'A'; description = 'Very Low Risk'; color = 'green'; copy = 'Low'; 
        }
        else if (creditScore >= 670) { 
            band = 'B'; description = 'Low Risk'; color = 'green'; copy = 'Low'; 
        }
        else if (creditScore >= 610) { 
            band = 'C'; description = 'Medium Risk'; color = 'amber'; copy = 'Medium'; 
        }
        else if (creditScore >= 550) { 
            band = 'D'; description = 'High Risk'; color = 'red'; copy = 'High'; 
        }
        else { 
            band = 'E'; description = 'Very High Risk'; color = 'red'; copy = 'High'; 
        }

        return { color, copy, band, description, score: creditScore };
    }, [creditScore, creditCheckStatus]);

    // STEP 3: Income Ratio Logic
    const incomeResult = useMemo((): IncomeResult => {
        const fees = monthlySchoolFees || 0;
        const income = monthlyDisposableIncome || 0;
        const missingData = !fees || !income || income === 0;

        let ratioPct = null;
        if (!missingData) {
            const ratio = fees / income;
            ratioPct = Math.round(ratio * 100);
        }

        // STEP 3: Overrides (Order matters: failed > missing > under_review > calculation)
        if (incomeDocsStatus === "failed") {
            return { color: 'red', copy: 'Over Threshold', ratioPct, description: 'Documents failed verification.' };
        }
        if (incomeDocsStatus === "missing" || missingData) {
            return { color: 'grey', copy: 'Pending...', ratioPct: missingData ? null : ratioPct, description: 'Documents missing or data unavailable.' };
        }
        if (incomeDocsStatus === "under_review") {
            // Override to Amber, even if ratio is Green, per instructions
            return {
                color: 'amber', 
                copy: `${ratioPct}% (Under Review)`,
                ratioPct,
                description: 'Documents are currently under review.'
            };
        }

        // STEP 3: Base Ratio Calculation (Docs verified or complete)
        let color, description;
        if (ratioPct && ratioPct <= 35) {
            color = 'green';
            description = 'affordable';
        } else if (ratioPct && ratioPct > 35 && ratioPct <= 50) {
            color = 'amber';
            description = 'tight';
        } else {
            color = 'red';
            description = 'over threshold';
        }

        return { color, copy: `${ratioPct}% (${description})`, ratioPct, description };
    }, [monthlySchoolFees, monthlyDisposableIncome, incomeDocsStatus]);

    // STEP 5: Decision Recommendation
    const decisionRecommendation = useMemo((): DecisionRecommendation => {
        return getDecisionRecommendation(creditResult.color, incomeResult.color);
    }, [creditResult.color, incomeResult.color]);

    // STEP 4: Header Badges - Only show Risk Flag for High risk
    const headerBadges = useMemo((): RiskBadge[] => {
        const creditColor = creditResult.color;
        const incomeColor = incomeResult.color;

        const isRed = creditColor === 'red' || incomeColor === 'red';

        const badges: RiskBadge[] = [];
        
        // Only show Risk Flag for High risk (red)
        if (isRed) {
            badges.push({ type: 'Risk Flag', status: 'High' });
        }

        return badges;
    }, [creditResult.color, incomeResult.color]);

    return { creditResult, incomeResult, decisionRecommendation, headerBadges };
};

// --- HELPER COMPONENTS ---

// Card Component
const Card = ({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
        {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}
        {children}
    </div>
);

// Badge Component
const Badge = ({ children, status, color, className = "" }: { children: React.ReactNode; status?: string; color?: string; className?: string }) => {
    let colorClasses = getColorClasses(color || status || 'grey').pill;
    if (!color) {
        // Fallback for non-risk status badges
        if (status === 'Pending Review' || status === 'Under Review' || status === 'Awaiting Documents') colorClasses = 'bg-yellow-100 text-yellow-700';
        else if (status === 'High' || status === 'Declined') colorClasses = 'bg-red-100 text-red-700';
        else if (status === 'Verified' || status === 'Approved') colorClasses = 'bg-green-100 text-green-700';
        else colorClasses = 'bg-gray-100 text-gray-600';
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${colorClasses} ${className}`}>
            {children}
        </span>
    );
};

// Icon/Field Row Helper
const InfoField = ({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value: string }) => (
    <div className="flex items-start space-x-2 text-sm text-gray-700">
        <Icon className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
        <div>
            <span className="font-medium">{label}: </span>
            <span>{value}</span>
        </div>
    </div>
);

// --- DOCUMENTS CARD COMPONENT ---
interface DocumentsCardProps {
  documents: Document[];
  onPreviewDocument: (docName: string) => void;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ documents, onPreviewDocument }) => {
  return (
    <Card title="Submitted Documents">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc, i) => (
          <div
            key={i}
            onClick={() => onPreviewDocument(doc.name)}
            className="flex flex-col items-start p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-200"
          >
            <div className="flex items-center w-full justify-between mb-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">
                  {doc.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {doc.status === 'Verified' ? (
                  <>
                    <CheckCircle2 className="text-green-600 w-5 h-5" />
                    <span className="text-xs font-medium text-green-700">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="text-yellow-600 w-5 h-5" />
                    <span className="text-xs font-medium text-yellow-700">
                      Under Review
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Uploaded: {doc.uploaded}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// --- DECISION ACTIONS PANEL ---
interface DecisionActionsPanelProps {
  applicationId: number;
  onDecisionMade: (decision: string, notes: string) => void;
  isLoading?: boolean;
}

type DecisionType = 'approve' | 'request_documents' | 'decline';

const DecisionActionsPanel: React.FC<DecisionActionsPanelProps> = ({
  applicationId,
  onDecisionMade,
  isLoading = false
}) => {
  const [decision, setDecision] = useState<DecisionType | ''>('');
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (!decision) return;
    setIsModalOpen(false);
    onDecisionMade(decision, notes);
    setDecision('');
    setNotes('');
  }, [decision, notes, onDecisionMade]);

  const handleActionClick = (action: DecisionType) => {
    setDecision(action);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDecision('');
  };

  // Decision button configurations
  const decisionButtons = [
    { 
      action: 'approve' as DecisionType, 
      label: 'Approve Application', 
      color: 'bg-green-600 hover:bg-green-700', 
      icon: Check 
    },
    { 
      action: 'request_documents' as DecisionType, 
      label: 'Request Documents', 
      color: 'bg-yellow-600 hover:bg-yellow-700', 
      icon: FileText 
    },
    { 
      action: 'decline' as DecisionType, 
      label: 'Decline Application', 
      color: 'bg-red-600 hover:bg-red-700', 
      icon: XCircle 
    },
  ];

  const getDecisionDisplayText = (decision: DecisionType): string => {
    switch (decision) {
      case 'approve':
        return 'APPROVE';
      case 'request_documents':
        return 'REQUEST DOCUMENTS';
      case 'decline':
        return 'DECLINE';
      default:
        return '';
    }
  };

  const getModalButtonColor = (decision: DecisionType): string => {
    switch (decision) {
      case 'approve':
        return 'bg-green-600 hover:bg-green-700';
      case 'request_documents':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'decline':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <>
      <Card title="Decision Actions">
        <div className="space-y-4">
          <div className="space-y-3">
            {decisionButtons.map(({ action, label, color, icon: Icon }) => (
              <button
                key={action}
                onClick={() => handleActionClick(action)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 text-white py-3 text-base font-semibold rounded-lg ${color} transition-colors disabled:opacity-50`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                {isLoading ? 'Processing...' : label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Decision Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your decision..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-yellow-50">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                Confirm Decision
              </h4>
            </div>
            
            <p className="mb-6 text-gray-700">
              Are you sure you want to{' '}
              <span className="font-semibold text-gray-900">
                {getDecisionDisplayText(decision as DecisionType)}
              </span>{' '}
              application <span className="font-mono text-sm bg-gray-100 px-1 rounded">APP-{applicationId}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-white font-semibold rounded-lg ${getModalButtonColor(decision as DecisionType)} transition disabled:opacity-50`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- MAIN COMPONENTS ---

const ApplicantSummaryCard = ({ data, riskData = {} }: { data: ApplicationData; riskData?: Partial<RiskData> }) => {
    const { student, parent, status } = data;
    
    // Header Badges - status and risk badges only
    const { headerBadges = [] } = riskData;

    const statusBadges = [
        <Badge key="status" status={status}>{data.status}</Badge>,
        ...headerBadges.map((badge, index) => (
            <Badge key={index} status={badge.status} color={badge.status === 'High' ? 'red' : 'amber'} className="ml-2 flex items-center">
                {badge.type === 'Risk Flag' && <ShieldAlert className="w-3 h-3 mr-1" />}
                {badge.type}
            </Badge>
        ))
    ];

    return (
        <Card title="Applicant Summary">
            <div className="flex justify-end space-x-2 mb-4">
                {statusBadges}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Learner Information */}
                <div>
                    <h3 className="flex items-center font-semibold text-lg text-indigo-600 mb-3">
                        <User className="w-5 h-5 mr-2" /> Learner Information
                    </h3>
                    <div className="space-y-2">
                        <InfoField label="Name" value={student.name} icon={User} />
                        <InfoField label="Grade" value={`Grade ${student.grade}`} icon={ChevronRight} />
                        <InfoField label="Date of Birth" value={new Date(student.dob).toLocaleDateString()} icon={Calendar} />
                        <InfoField label="Previous School" value={student.previousSchool} icon={School} />
                    </div>
                </div>

                {/* Parent/Guardian Information */}
                <div>
                    <h3 className="flex items-center font-semibold text-lg text-indigo-600 mb-3">
                        <Users className="w-5 h-5 mr-2" /> Parent/Guardian
                    </h3>
                    <div className="space-y-2">
                        <InfoField label="Name" value={parent.name} icon={User} />
                        <InfoField label="Phone" value={parent.phone} icon={Phone} />
                        <InfoField label="Email" value={parent.email} icon={Mail} />
                        <InfoField label="Address" value={parent.address} icon={Home} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

const RiskAssessmentCard = ({ data, riskData = {} }: { data: ApplicationData; riskData?: Partial<RiskData> }) => {
    const { creditResult, incomeResult } = riskData;
    const { monthlySchoolFees, monthlyDisposableIncome } = data;

    // Safety defaults for loading states
    const safeCreditResult: CreditResult = creditResult || { color: 'grey', copy: 'Pending...', band: null, description: 'Data loading...' };
    const safeIncomeResult: IncomeResult = incomeResult || { color: 'grey', copy: 'Pending...', ratioPct: 0, description: 'Data loading...' };

    const creditClasses = getColorClasses(safeCreditResult.color);
    const incomeClasses = getColorClasses(safeIncomeResult.color);
    
    // Formatting currency for South Africa (ZAR)
    const feeFormatted = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(monthlySchoolFees);
    const incomeFormatted = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(monthlyDisposableIncome);

    return (
        <Card title="Risk Assessment" className="mt-6">
            <div className="grid md:grid-cols-2 gap-4">
                {/* Credit Risk Block */}
                <div className={`p-4 rounded-lg border ${creditClasses.bg}`}>
                    <h3 className="flex items-center font-semibold mb-2 text-lg">
                        <ShieldAlert className="w-5 h-5 mr-2" /> Credit Risk: <span className={`ml-1`}>{safeCreditResult.copy}</span>
                    </h3>
                    <p className="text-sm font-medium">
                        Band {safeCreditResult.band || 'N/A'}: {safeCreditResult.description}
                        {safeCreditResult.score && ` (Score: ${safeCreditResult.score})`}
                    </p>
                </div>

                {/* Income Ratio Block */}
                <div className={`p-4 rounded-lg border ${incomeClasses.bg}`}>
                    <h3 className="flex items-center font-semibold mb-2 text-lg">
                        <DollarSign className="w-5 h-5 mr-2" /> Income Ratio: {safeIncomeResult.copy}
                    </h3>
                    <p className="text-sm font-medium">
                        {safeIncomeResult.description.charAt(0).toUpperCase() + safeIncomeResult.description.slice(1)} status.
                    </p>
                </div>
            </div>

            {/* Fee-to-Income Ratio Visualization */}
            <h3 className="font-semibold text-lg text-gray-800 mt-6 mb-3 border-t pt-4">Fee-to-Income Ratio</h3>
            <div className="space-y-1">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Monthly School Fees</span>
                    <span>{feeFormatted}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Disposable Income</span>
                    <span>{incomeFormatted}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${getColorClasses(safeIncomeResult.color).pill}`}
                        style={{ width: `${safeIncomeResult.ratioPct && safeIncomeResult.ratioPct > 100 ? 100 : safeIncomeResult.ratioPct || 0}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>{safeIncomeResult.ratioPct || 0}%</span>
                    <span>100%</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">{safeIncomeResult.ratioPct || 'N/A'}%</span> ({feeFormatted} of {incomeFormatted})
                </p>
            </div>
        </Card>
    );
};

// Decision Recommendation Component
const DecisionRecommendationCard = ({ recommendation = {} }: { recommendation?: Partial<DecisionRecommendation> }) => {
    const { copy = 'Review', icon: Icon = ListOrdered, color = 'amber' } = recommendation;
    const classes = getColorClasses(color);

    return (
        <Card title="Decision Recommendation" className="mb-6">
            <div className={`flex items-center p-4 rounded-lg border ${classes.bg} transition-all duration-300`}>
                <Icon className={`w-8 h-8 mr-4 ${color === 'red' ? 'text-red-600' : color === 'green' ? 'text-green-600' : 'text-yellow-600'}`} />
                <div>
                    <p className="text-lg font-semibold text-gray-900">Recommended Action:</p>
                    <p className="text-2xl font-bold mt-1">
                        {copy}
                    </p>
                </div>
            </div>
        </Card>
    );
};

const ApplicationTimeline = ({ timeline = [] }: { timeline?: TimelineEvent[] }) => {
    const sortedTimeline = useMemo(() => {
        return [...timeline].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [timeline]);

    const formatTimestamp = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' +
               date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <Card title="Application Timeline" className="mt-6">
            <ol className="relative border-l border-gray-200 ml-3">
                {sortedTimeline.map((item, index) => {
                    const isCurrent = index === sortedTimeline.length - 1;
                    const dotColor = isCurrent ? 'bg-indigo-500' : 'bg-green-500';
                    const textColor = isCurrent ? 'text-indigo-700 font-semibold' : 'text-gray-700';
                    
                    let badgeStatus;
                    if (isCurrent) {
                         badgeStatus = 'Under Review';
                    } else if (item.event.startsWith('Decision: APPROVED') || item.event.startsWith('Decision: AWAITING DOCUMENTS')) {
                        badgeStatus = 'Awaiting Documents';
                    } else {
                        badgeStatus = 'Verified';
                    }

                    return (
                        <li key={index} className="mb-8 ml-6">
                            <span className={`absolute flex items-center justify-center w-3 h-3 ${dotColor} rounded-full -left-[6px] ring-4 ring-white`}></span>
                            <h3 className={`font-semibold ${textColor}`}>{item.event}</h3>
                            <time className="block mb-2 text-xs font-normal leading-none text-gray-500">
                                {formatTimestamp(item.timestamp)}
                            </time>
                            {item.note && (
                                <p className="text-sm text-red-500 italic mt-1">{item.note}</p>
                            )}
                            {isCurrent && <Badge status={badgeStatus} className="mt-2">Current Status</Badge>}
                        </li>
                    );
                })}
            </ol>
        </Card>
    );
};

// Preview Modal Component
const PreviewModal = ({
  open,
  onClose,
  docName,
}: {
  open: boolean;
  onClose: () => void;
  docName: string;
}) => {
  if (!open) return null;

  // Simulate document type by name
  const isPDF =
    docName.toLowerCase().includes('id') ||
    docName.toLowerCase().includes('statement') ||
    docName.toLowerCase().includes('payslip');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] md:w-[70%] lg:w-[50%] max-h-[90vh] flex flex-col overflow-hidden relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Previewing: {docName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center">
          {isPDF ? (
            <iframe
              src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              title={docName}
              className="w-full h-full min-h-[70vh]"
            />
          ) : (
            <img
              src="https://via.placeholder.com/800x1000.png?text=Document+Preview"
              alt={docName}
              className="object-contain max-h-[80vh]"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Close
          </button>
          <button
            onClick={() =>
              alert(`Downloading ${docName} (demo - replace with real file)`)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---

export default function ApplicationReview() {
    const { id } = useParams(); // Get application ID from URL
    const applicationId = parseInt(id as string) || mockApplicationData.id;
    
    const [data, setData] = useState<ApplicationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDecisionLoading, setIsDecisionLoading] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [active, setActive] = useState('Applications');

    // Risk Assessment Hook with all business logic
    const riskData = useRiskAssessment(data || {});

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Applications', icon: Users },
        { name: 'Students', icon: Users },
        { name: 'Payments', icon: CreditCard },
        { name: 'Documents', icon: FolderOpen },
        { name: 'Analyses', icon: LineChart },
        { name: 'Notifications', icon: Bell },
    ];

    // Data Fetching
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const fetchedData = await fetchData(applicationId);
                setData({
                    ...fetchedData,
                    monthlySchoolFees: fetchedData.monthlySchoolFees || 4500,
                    monthlyDisposableIncome: fetchedData.monthlyDisposableIncome || 10000,
                });
            } catch (error) {
                console.error("Failed to fetch application data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [applicationId]);

    const handleDecisionMade = useCallback(async (decision: string, notes: string) => {
        setIsDecisionLoading(true);
        try {
            const response = await postDecision(applicationId, decision, notes);
            if (response.success) {
                const newStatus = response.newStatus.charAt(0).toUpperCase() + response.newStatus.slice(1);
                setData(prevData => {
                    if (!prevData) return prevData;
                    return {
                        ...prevData,
                        status: newStatus as 'Pending Review' | 'Approved' | 'Declined' | 'Awaiting Documents',
                        timeline: [...prevData.timeline, { event: `Decision: ${newStatus.toUpperCase()}`, timestamp: new Date().toISOString(), note: notes || undefined }]
                    };
                });
            }
        } catch (error) {
            console.error("Decision failed:", error);
        } finally {
            setIsDecisionLoading(false);
        }
    }, [applicationId]);

    const handleExportPDF = () => {
        console.log(`[Action] Requesting summary PDF download for application ${applicationId}...`);
        console.log(`[Simulation] Generated PDF summary for application ${applicationId} and prompted download.`);
    };

    const handleExportCSV = () => {
        if (!data) return;
        
        const csvContent = [
            'Application Summary',
            `ID,${data.id}`,
            `Student Name,${data.student.name}`,
            `Grade,Grade ${data.student.grade}`,
            `Date of Birth,${data.student.dob}`,
            `Previous School,${data.student.previousSchool}`,
            `Parent Name,${data.parent.name}`,
            `Parent Phone,${data.parent.phone}`,
            `Parent Email,${data.parent.email}`,
            `Parent Address,${data.parent.address}`,
            `Status,${data.status}`,
            `Credit Risk,${riskData.creditResult.copy}`,
            `Credit Score,${data.creditScore}`,
            `Income Ratio,${riskData.incomeResult.copy}`,
            `Monthly Fees,${data.monthlySchoolFees}`,
            `Disposable Income,${data.monthlyDisposableIncome}`,
            '',
            'Decision Recommendation',
            `Recommendation,${riskData.decisionRecommendation.copy}`
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `application_${data.id}_summary.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        console.log(`[Action] Initiating print preview for application ${applicationId}.`);
        window.print();
    };

    const previewDocument = (docName: string) => {
        setPreviewDoc(docName);
    };

    const closePreview = () => {
        setPreviewDoc(null);
    };

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="flex items-center space-x-3 text-lg font-medium text-indigo-600">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading Application Data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r">
                <div className="px-6 py-4 border-b flex items-center gap-2">
                    <div className="p-2 rounded bg-blue-50">
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-blue-700">SchoolRegister Admin</h2>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = active === item.name;
                        return (
                            <button
                                key={item.name}
                                onClick={() => setActive(item.name)}
                                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className={`h-4 w-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button className="flex items-center text-sm text-gray-600 hover:text-red-600">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </button>
                </div>
            </aside>

            {/* Main Section */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-white border-b p-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="hover:text-blue-600 cursor-pointer">Applications</span>
                        <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                        <span className="text-gray-800 font-medium">Application Review</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <p className="font-medium text-gray-800">Admin User</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-blue-600 text-white">
                            AU
                        </div>
                    </div>
                </header>

                <main className="p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-medium text-blue-800">Application Review</h1>
                                <p className="text-gray-500 text-sm">
                                    Review and make decisions on student applications
                                </p>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center space-x-2 bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg"
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>Print</span>
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    className="flex items-center space-x-2 bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>Export PDF</span>
                                </button>
                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center space-x-2 bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Export CSV</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <ApplicantSummaryCard data={data} riskData={riskData} />
                                <RiskAssessmentCard data={data} riskData={riskData} />
                                <DocumentsCard documents={data.documents} onPreviewDocument={previewDocument} />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <DecisionRecommendationCard recommendation={riskData.decisionRecommendation} />
                                <DecisionActionsPanel
                                    applicationId={applicationId}
                                    onDecisionMade={handleDecisionMade}
                                    isLoading={isDecisionLoading}
                                />
                                <ApplicationTimeline timeline={data.timeline} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Preview Modal */}
            <PreviewModal open={!!previewDoc} onClose={closePreview} docName={previewDoc || ''} />
        </div>
    );
}