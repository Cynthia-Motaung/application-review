"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, CreditCard, FolderOpen, LineChart, Bell, Settings,
  Search, Filter, Plus, ChevronDown, Calendar, Download, Eye, ArrowLeft,
  ChevronRight
} from 'lucide-react';
import ApplicationReview from '../components/ApplicationReview';
import PaymentDashboard from '../components/PaymentDashboard';

interface ApplicationSummary {
  id: number;
  studentName: string;
  parentName: string;
  grade: string;
  status: 'Pending Review' | 'Approved' | 'Declined' | 'Awaiting Documents';
  submittedDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

const DashboardPage = () => {
  const [active, setActive] = useState('Dashboard');
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'review' | 'payments'>('dashboard');
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Applications', icon: Users },
    { name: 'Students', icon: Users },
    { name: 'Payments', icon: CreditCard },
    { name: 'Documents', icon: FolderOpen },
    { name: 'Analyses', icon: LineChart },
    { name: 'Notifications', icon: Bell },
  ];

  const stats = [
    { label: 'Total Applications', value: '1,234', change: '+12%', trend: 'up' },
    { label: 'Pending Review', value: '89', change: '+5%', trend: 'up' },
    { label: 'Approved', value: '856', change: '+8%', trend: 'up' },
    { label: 'High Risk', value: '23', change: '-3%', trend: 'down' },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setApplications([
          { id: 12345, studentName: 'John Smith', parentName: 'Sarah Smith', grade: '5', status: 'Pending Review', submittedDate: '2024-01-15', riskLevel: 'Medium' },
          { id: 12346, studentName: 'Emma Johnson', parentName: 'Michael Johnson', grade: '3', status: 'Approved', submittedDate: '2024-01-14', riskLevel: 'Low' },
          { id: 12347, studentName: 'Liam Brown', parentName: 'Jessica Brown', grade: '7', status: 'Awaiting Documents', submittedDate: '2024-01-13', riskLevel: 'High' },
          { id: 12348, studentName: 'Sophia Davis', parentName: 'David Davis', grade: '2', status: 'Declined', submittedDate: '2024-01-12', riskLevel: 'High' },
          { id: 12349, studentName: 'Noah Wilson', parentName: 'Jennifer Wilson', grade: '4', status: 'Pending Review', submittedDate: '2024-01-11', riskLevel: 'Medium' },
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchApplications();
  }, []);

  const handleViewApplication = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setCurrentView('review');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedApplicationId(null);
  };

  const handleNavItemClick = (itemName: string) => {
    setActive(itemName);
    
    if (itemName === 'Payments') {
      setCurrentView('payments');
    } else if (itemName === 'Dashboard') {
      setCurrentView('dashboard');
    }
  };

  const getStatusColor = (status: ApplicationSummary['status']) => {
    switch (status) {
      case 'Pending Review': return 'bg-amber-100 text-amber-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Declined': return 'bg-red-100 text-red-700';
      case 'Awaiting Documents': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (riskLevel: ApplicationSummary['riskLevel']) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredApplications = applications.filter(app =>
    app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toString().includes(searchTerm)
  );

  if (currentView === 'review' && selectedApplicationId) {
    return (
      <ApplicationReview 
        applicationId={selectedApplicationId}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'payments') {
    return (
      <div className="flex min-h-screen bg-gray-50">
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
                  onClick={() => handleNavItemClick(item.name)}
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

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b p-4 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="hover:text-blue-600 cursor-pointer flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              <span className="text-gray-800 font-medium">Payment Status Tracking</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-blue-600">
                <Bell className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <PaymentDashboard />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
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
                onClick={() => handleNavItemClick(item.name)}
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

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-gray-800 font-medium">Dashboard</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Bell className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
                  <p className="text-gray-600 text-sm mt-1">Manage and review student applications</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    <Plus className="h-4 w-4" />
                    <span>New Application</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent/Guardian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span>Loading applications...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          APP-{app.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.parentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Grade {app.grade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(app.riskLevel)}`}>
                            {app.riskLevel} Risk
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(app.submittedDate).toLocaleDateString('en-ZA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewApplication(app.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredApplications.length}</span> applications
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;