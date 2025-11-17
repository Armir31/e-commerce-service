import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { paymentAPI, customerAPI } from '../services/api';

const PaymentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    payment_date: '',
    amount: '',
    payment_method: '',
    payment_status: '',
    transaction_id: '',
    customer_id: ''
  });

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
    if (isEditing) {
      fetchPayment();
    } else {
      // Set default date to today for new payments
      setFormData(prev => ({
        ...prev,
        payment_date: new Date().toISOString().split('T')[0],
        payment_status: 'PENDING'
      }));
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setErrors({ customers: 'Failed to load customers. Please refresh the page.' });
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getById(id);
      const payment = response.data;
      setFormData({
        payment_date: payment.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : '',
        amount: payment.amount || '',
        payment_method: payment.payment_method || '',
        payment_status: payment.payment_status || '',
        transaction_id: payment.transaction_id || '',
        customer_id: payment.customer_id?.toString() || payment.customer?.id?.toString() || ''
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required';
    }

    if (!formData.payment_status) {
      newErrors.payment_status = 'Payment status is required';
    }

    if (!formData.customer_id || isNaN(parseInt(formData.customer_id))) {
      newErrors.customer_id = 'Valid customer is required';
    }

    if (!formData.transaction_id || formData.transaction_id.trim().length < 3) {
      newErrors.transaction_id = 'Transaction ID is required and must be at least 3 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Ensure customer_id is valid
      const customerId = parseInt(formData.customer_id);
      if (isNaN(customerId)) {
        setErrors({ submit: 'Invalid customer ID. Please try again.' });
        return;
      }

      const submitData = {
        ...formData,
        amount: formData.amount.toString(),
        payment_date: new Date(formData.payment_date).toISOString(),
        customer_id: customerId
      };

      if (isEditing) {
        await paymentAPI.update(id, submitData);
      } else {
        await paymentAPI.create(submitData);
      }

      navigate('/payments');
    } catch (error) {
      console.error('Error saving payment:', error);
      setErrors({ submit: 'Failed to save payment. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/payments')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payments
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Payment' : 'Add New Payment'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update payment information' : 'Record a new payment transaction'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Payment Date */}
          <div className="mb-6">
            <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date *
            </label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.payment_date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.payment_date && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_date}</p>
            )}
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <select
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.payment_method ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select payment method</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="PAYPAL">PayPal</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            </select>
            {errors.payment_method && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
            )}
          </div>

          {/* Payment Status */}
          <div className="mb-6">
            <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status *
            </label>
            <select
              id="payment_status"
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.payment_status ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select payment status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            {errors.payment_status && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_status}</p>
            )}
          </div>

          {/* Transaction ID */}
          <div className="mb-6">
            <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              id="transaction_id"
              name="transaction_id"
              value={formData.transaction_id}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.transaction_id ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter transaction ID (required)"
            />
            {errors.transaction_id && (
              <p className="mt-1 text-sm text-red-600">{errors.transaction_id}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Required: Enter a unique transaction identifier from your payment processor
            </p>
          </div>

          {/* Customer Selection */}
          <div className="mb-6">
            <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-2">
              Customer *
            </label>
            {customersLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm text-gray-500">Loading customers...</span>
              </div>
            ) : (
              <>
                <select
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.customer_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email || 'No email'})
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>
                )}
                {errors.customers && (
                  <p className="mt-1 text-sm text-red-600">{errors.customers}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Select the customer who made this payment
                </p>
              </>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/payments')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : (isEditing ? 'Update Payment' : 'Create Payment')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
