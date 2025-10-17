import jsPDF from 'jspdf';
import { ApplicationData, RiskData } from '@/types/application';

export const generateApplicationPDF = (applicationData: ApplicationData, riskData: RiskData): jsPDF => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 128); // Blue color
  pdf.text('Application Review Summary', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Application ID
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Application ID: APP-${applicationData.id}`, 20, yPosition);
  yPosition += 10;

  // Generated date
  pdf.text(`Generated: ${new Date().toLocaleDateString('en-ZA')}`, 20, yPosition);
  yPosition += 20;

  // Student Information
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 128);
  pdf.text('Student Information', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${applicationData.student.name}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Grade: Grade ${applicationData.student.grade}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Date of Birth: ${new Date(applicationData.student.dob).toLocaleDateString('en-ZA')}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Previous School: ${applicationData.student.previousSchool}`, 20, yPosition);
  yPosition += 15;

  // Parent Information
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 128);
  pdf.text('Parent/Guardian Information', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${applicationData.parent.name}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Email: ${applicationData.parent.email}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Phone: ${applicationData.parent.phone}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Address: ${applicationData.parent.address}`, 20, yPosition);
  yPosition += 20;

  // Risk Assessment
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 128);
  pdf.text('Risk Assessment', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Credit Risk
  pdf.text('Credit Risk:', 20, yPosition);
  pdf.text(`${riskData.creditResult.copy} (Band ${riskData.creditResult.band})`, 60, yPosition);
  yPosition += 6;
  
  // Income Ratio
  pdf.text('Income Ratio:', 20, yPosition);
  pdf.text(`${riskData.incomeResult.copy}`, 60, yPosition);
  yPosition += 6;
  
  // Monthly Fees
  const monthlyFee = applicationData.monthlyFee || applicationData.monthlySchoolFees || 0;
  const disposableIncome = applicationData.disposableIncome || applicationData.monthlyDisposableIncome || 0;
  pdf.text('Monthly Fees:', 20, yPosition);
  pdf.text(`R ${monthlyFee.toLocaleString('en-ZA')}`, 60, yPosition);
  yPosition += 6;
  
  pdf.text('Disposable Income:', 20, yPosition);
  pdf.text(`R ${disposableIncome.toLocaleString('en-ZA')}`, 60, yPosition);
  yPosition += 15;

  // Decision Recommendation
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 128);
  pdf.text('Decision Recommendation', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(riskData.decisionRecommendation.copy, 20, yPosition);
  yPosition += 15;

  // Application Status
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 128);
  pdf.text('Current Status', 20, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(applicationData.status, 20, yPosition);

  return pdf;
};