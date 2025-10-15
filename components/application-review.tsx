'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Home,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  TrendingUp,
  Printer,
  Download,
  ChevronRight,
  LayoutDashboard,
  Users,
  FolderOpen,
  LineChart,
  Bell,
  Check,
  X,
  Dot,
  Settings,
} from 'lucide-react';

export default function ApplicationReview() {
  const [active, setActive] = useState('Applications');
  const [notes, setNotes] = useState('');

  const data = {
    student: {
      name: 'Sarah Johnson',
      grade: 'Grade 8',
      dob: '15/03/2010',
      prevSchool: 'Greenfield Primary',
    },
    parent: {
      name: 'Michael Johnson',
      phone: '+27 82 123 4567',
      email: 'm.johnson@email.com',
      address: '123 Oak Street, Cape Town',
    },
    risk: {
      credit: 'High',
      creditDesc: 'Credit score below threshold (580)',
      incomeRatio: 45, // number (percent)
      incomeDesc: 'School fees represent 45% of disposable income',
      monthlyFee: 'R 4,500',
      disposable: 'R 10,000',
    },
    documents: [
      { name: 'ID Document', status: 'Verified' },
      { name: 'Proof of Address', status: 'Verified' },
      { name: 'Bank Statement', status: 'Under Review' },
      { name: 'Payslip', status: 'Verified' },
    ],
    timeline: [
      { name: 'Application Submitted', time: 'Oct 8, 2024 - 2:30 PM', status: 'done' },
      { name: 'Documents Uploaded', time: 'Oct 8, 2024 - 3:15 PM', status: 'done' },
      { name: 'Credit Check Completed', time: 'Oct 8, 2024 - 4:00 PM', status: 'done' },
      { name: 'Under Review', time: 'Current Status', status: 'current' },
    ],
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Applications', icon: Users },
    { name: 'Students', icon: Users },
    { name: 'Payments', icon: CreditCard },
    { name: 'Documents', icon: FolderOpen },
    { name: 'Analyses', icon: LineChart },
    { name: 'Notifications', icon: Bell },
  ];

  function confirmAction(action: string) {
    const confirmed = window.confirm(`Are you sure you want to ${action}?`);
    return confirmed;
  }

  function handleAction(action: 'Approve' | 'Request Documents' | 'Decline') {
    if (!confirmAction(action)) return;

    // TODO: replace with API integration
    alert(`${action} action confirmed. (stubbed)`);
  }

  function handlePrint() {
    window.print();
  }

  function downloadCSV() {
    // simple CSV export for the application summary + documents
    const rows: string[][] = [];
    rows.push(['Section', 'Field', 'Value']);
    rows.push(['Student', 'Name', data.student.name]);
    rows.push(['Student', 'Grade', data.student.grade]);
    rows.push(['Student', 'DOB', data.student.dob]);
    rows.push(['Student', 'Previous School', data.student.prevSchool]);
    rows.push(['Parent', 'Name', data.parent.name]);
    rows.push(['Parent', 'Phone', data.parent.phone]);
    rows.push(['Parent', 'Email', data.parent.email]);
    rows.push(['Parent', 'Address', data.parent.address]);
    rows.push(['Risk', 'Credit', data.risk.credit]);
    rows.push(['Risk', 'Credit Description', data.risk.creditDesc]);
    rows.push(['Risk', 'Income Ratio', `${data.risk.incomeRatio}%`]);

    data.documents.forEach((d) => {
      rows.push(['Document', d.name, d.status]);
    });

    const csvContent = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'application_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on small */}
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
            <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-blue-600 text-white">AU</div>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-medium text-blue-800">Application Review</h1>
                <p className="text-gray-500 text-sm">Review and make decisions on student applications</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handlePrint} className="flex items-center space-x-2 bg-transparent hover:bg-gray-100 text-gray-700">
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </Button>
                <Button variant="outline" onClick={downloadCSV} className="flex items-center space-x-2 bg-transparent hover:bg-gray-100 text-gray-700">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left - summary & risk */}
              <div className="lg:col-span-2 space-y-6">
                {/* Applicant Summary - All sections in one card with horizontal dividers */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-gray-700 font-medium">Applicant Summary</CardTitle>
                      <div className="flex gap-2 items-center">
                        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</Badge>
                        {data.risk.credit === 'High' && (
                          <Badge className="bg-red-50 text-red-700 border-red-200 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>Risk Flag</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Combined Student & Parent Information Section */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Information */}
                        <div className="space-y-4 ">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span>Student Information</span>
                          </h4>
                          <div className="text-sm space-y-2 text-gray-900">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Name:</span>
                              <span>{data.student.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Grade:</span>
                              <span>{data.student.grade}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Date of Birth:</span>
                              <span>{data.student.dob}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Previous School:</span>
                              <span>{data.student.prevSchool}</span>
                            </div>
                          </div>
                        </div>

                        {/* Parent/Guardian Information */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>Parent/Guardian</span></h4>
                          <div className="text-sm space-y-2 text-gray-900">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Name:</span>
                              <span>{data.parent.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Phone:</span>
                              <span>{data.parent.phone}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Email:</span>
                              <span>{data.parent.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Address:</span>
                              <span>{data.parent.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Divider */}
                    <hr className="border-gray-200" />

                    {/* Risk Assessment Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span>Risk Assessment</span>
                      </h3>

                      <div className="space-y-4">
                        {/* Credit Risk and Income Ratio side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Credit Risk */}
                          <div className={`rounded-lg p-4 ${data.risk.credit === 'High' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                            <p className={`font-semibold ${data.risk.credit === 'High' ? 'text-red-700' : 'text-green-700'}`}>Credit Risk: {data.risk.credit}</p>
                            <p className={`text-sm mt-1 ${data.risk.credit === 'High' ? 'text-red-600' : 'text-green-600'}`}>{data.risk.creditDesc}</p>
                          </div>

                          {/* Income Ratio */}
                          <div className={`rounded-lg p-4 ${data.risk.incomeRatio >= 50 ? 'bg-red-50 border border-red-200' : data.risk.incomeRatio >= 30 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                            <p className={`font-semibold ${data.risk.incomeRatio >= 50 ? 'text-red-700' : data.risk.incomeRatio >= 30 ? 'text-yellow-700' : 'text-green-700'}`}>Income Ratio: {data.risk.incomeRatio}%</p>
                            <p className="text-sm mt-1 text-gray-700">{data.risk.incomeDesc}</p>
                          </div>
                        </div>

                        {/* Fee-to-Income */}
                        <div className="rounded-lg p-4 bg-gray-50 border border-gray-100">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Fee-to-Income Ratio</h4>

                          <div className="text-sm space-y-2 mb-3">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-800">Monthly School Fees</span>
                              <span className="text-gray-900">{data.risk.monthlyFee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-800">Disposable Income</span>
                              <span className="text-gray-900">{data.risk.disposable}</span>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="h-3 rounded-full" style={{ width: `${data.risk.incomeRatio}%`, backgroundColor: data.risk.incomeRatio >= 50 ? '#fca5a5' : data.risk.incomeRatio >= 30 ? '#fcd34d' : '#86efac' }} />
                          </div>

                          <div className="mt-2 text-xs text-gray-600">{data.risk.incomeRatio}% of disposable income</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Submission - Remains in its own card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-800 font-semibold">Submitted Documents</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.documents.map((doc, i) => (
                        <div key={i} className="flex flex-col items-start p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white">
                          <div className="flex items-center w-full justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-gray-700" />
                              <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {doc.status === 'Verified' ? (
                                <>
                                  <CheckCircle2 className="text-green-600 w-5 h-5" />
                                  <span className="text-xs font-medium text-green-700">Verified</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="text-yellow-600 w-5 h-5" />
                                  <span className="text-xs font-medium text-yellow-700">Under Review</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="text-xs text-gray-500">Uploaded: Oct 8, 2024</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Decision Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-800 font-medium">Decision Actions</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Button onClick={() => handleAction('Approve')} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3">
                        <Check className="h-4 w-4" /> Approve Application
                      </Button>

                      <Button onClick={() => handleAction('Request Documents')} className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3">
                        <FileText className="h-4 w-4" /> Request Documents
                      </Button>

                      <Button onClick={() => handleAction('Decline')} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3">
                        <X className="h-4 w-4" /> Decline Application
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Decision Notes</label>
                      <Textarea value={notes} onChange={(e) => setNotes((e.target as HTMLTextAreaElement).value)} placeholder="Add notes about your decision..." className="min-h-[100px] mt-2 resize-none text-black" />
                    </div>
                  </CardContent>
                </Card>

                {/* Application Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-800 font-medium">Application Timeline</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {data.timeline.map((t, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${t.status === 'done' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {t.status === 'current' ? <Dot className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-600">{t.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}