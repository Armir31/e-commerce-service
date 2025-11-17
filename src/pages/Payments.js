import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, CreditCard, DollarSign, User } from 'lucide-react';
import { paymentAPI, customerAPI } from '../services/api';
import { formatPrice, formatDate, getPaymentStatusColor, getPaymentMethodIcon } from '../utils';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      fetchPayments();
    }
  }, [customers]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getAll();
      console.log('Fetched payments data:', response.data);
      
      // Check if payments have customer data, if not, we'll need to fetch it separately
      const paymentsWithCustomerData = response.data.map(payment => {
        if (!payment.customer && payment.customer_id) {
          const customer = customers.find(c => c.id.toString() === payment.customer_id.toString());
          return {
            ...payment,
            customer: customer || null
          };
        }
        return payment;
      });
      
      setPayments(paymentsWithCustomerData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment record? This action cannot be undone.')) {
      try {
        await paymentAPI.delete();
        setPayments(payments.filter(payment => payment.id !== id));
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount?.includes(searchTerm);
    
    const matchesStatus = !statusFilter || payment.payment_status === statusFilter;
    const matchesMethod = !methodFilter || payment.payment_method === methodFilter;
    const matchesCustomer = !customerFilter || payment.customer_id?.toString() === customerFilter || payment.customer?.id?.toString() === customerFilter;
    
    return matchesSearch && matchesStatus && matchesMethod && matchesCustomer;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.payment_date) - new Date(a.payment_date);
      case 'amount':
        return parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
      case 'status':
        return (a.payment_status || '').localeCompare(b.payment_status || '');
      case 'method':
        return (a.payment_method || '').localeCompare(b.payment_method || '');
      default:
        return 0;
    }
  });

  const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
  const paymentMethods = ['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'];

  // Helper function to get customer information
  const getCustomerInfo = (payment) => {
    if (payment.customer) {
      return payment.customer;
    }
    if (payment.customer_id) {
      return customers.find(c => c.id.toString() === payment.customer_id.toString());
    }
    return null;
  };

  if (loading || customersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">
          {customersLoading ? 'Loading customers...' : 'Loading payments...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track and manage payment transactions</p>
        </div>
        <Link
          to="/payments/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Methods</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method.replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
            <option value="method">Sort by Method</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setMethodFilter('');
              setCustomerFilter('');
              setSortBy('date');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{payment.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.transaction_id || 'No transaction ID'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getPaymentMethodIcon(payment.payment_method)}</span>
                      <span className="text-sm text-gray-900">
                        {payment.payment_method?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.payment_status)}`}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        {(() => {
                          const customer = getCustomerInfo(payment);
                          return (
                            <>
                              <div className="text-sm font-medium text-gray-900">
                                {customer?.name || 'Unknown Customer'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {payment.customer_id || customer?.id || 'N/A'}
                                {customer?.email && (
                                  <span className="block text-xs text-gray-400">
                                    {customer.email}
                                  </span>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/payments/edit/${payment.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sortedPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CreditCard className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter || methodFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first payment record.'
            }
          </p>
          {!searchTerm && !statusFilter && !methodFilter && (
            <Link
              to="/payments/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Link>
          )}
        </div>
      )}

      {/* Payment Statistics */}
      {payments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {paymentStatuses.map((status) => {
            const count = payments.filter(payment => payment.payment_status === status).length;
            const totalAmount = payments
              .filter(payment => payment.payment_status === status)
              .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
            
            return (
              <div key={status} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <DollarSign className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{status}</p>
                    <p className="text-2xl font-semibold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">{formatPrice(totalAmount)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Payments;
