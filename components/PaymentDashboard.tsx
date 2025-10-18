'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Bell,
  Search,
  Filter,
  Settings,
  ChevronDown,
  Mail,
  Phone
} from 'lucide-react';
import { PaymentMetrics, PaymentRecord, PaymentFilters } from '@/types/payment';
import { api } from '@/lib/api';

const PaymentDashboard = () => {
  const [metrics, setMetrics] = useState<PaymentMetrics | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const [filters, setFilters] = useState<PaymentFilters>({
    status: 'all',
    grade: 'all',
    paymentMethod: 'all',
    search: ''
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await api.getPayments(filters);
      setMetrics(data.metrics);
      setPayments(data.payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleSendReminders = async () => {
    if (selectedPayments.length === 0) return;
    
    setSendingReminders(true);
    try {
      const response = await api.sendPaymentReminders(selectedPayments);
      
      if (response.success) {
        alert(`Reminders sent successfully to ${selectedPayments.length} families`);
        setSelectedPayments([]);
        fetchPayments();
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Failed to send reminders');
    } finally {
      setSendingReminders(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(true);
    try {
      const blob = await api.exportPayments(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-report.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map(p => p.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Status Tracking</h1>
          <p className="text-gray-600">Monitor payment collections and track overdue families</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
          <button
            onClick={handleSendReminders}
            disabled={sendingReminders || selectedPayments.length === 0}
            className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50"
          >
            <Bell className="w-4 h-4" />
            <span>
              {sendingReminders 
                ? 'Sending...' 
                : `Send Reminders (${selectedPayments.length})`
              }
            </span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalOutstanding)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collected This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.collectedThisMonth)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.overduePayments)}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {metrics.overdueFamilies} families
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metrics.collectionRate}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Success rate this month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {metrics && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{metrics.totalFamilies}</p>
              <p className="text-sm text-gray-600">Total Families</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{metrics.onTimePayments}</p>
              <p className="text-sm text-gray-600">On-Time Payments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{metrics.pendingPayments}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.overdueFamilies}</p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by family or learner name..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="on-time">On Time</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={filters.grade}
            onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Grades</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
              <option key={grade} value={grade.toString()}>Grade {grade}</option>
            ))}
          </select>

          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Methods</option>
            <option value="debit">Debit Order</option>
            <option value="eft">EFT</option>
            <option value="card">Credit Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment Tracking</h3>
          <p className="text-gray-600 text-sm mt-1">
            {payments.length} families found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedPayments.length === payments.length && payments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Family
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Learner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr 
                  key={payment.id} 
                  className={selectedPayments.includes(payment.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={() => handleSelectPayment(payment.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.familyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{payment.learnerName}</div>
                      <div className="text-xs text-gray-500">Grade {payment.grade}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amountDue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.dueDate).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1 capitalize">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.open(`mailto:${payment.contactEmail}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => window.open(`tel:${payment.contactPhone}`)}
                        className="text-green-600 hover:text-green-800"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payments found matching your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;