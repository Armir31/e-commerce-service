import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { businessAPI } from '../services/api';

const BusinessForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    address: '',
    logo: '',
    website: '',
    phone_number: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchBusiness();
    }
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await businessAPI.getById(id);
      const business = response.data;
      setFormData({
        name: business.name || '',
        email: business.email || '',
        username: business.username || '',
        address: business.address || '',
        logo: business.logo || '',
        website: business.website || '',
        phone_number: business.phoneNumber || business.phone_number || ''
      });
    } catch (error) {
      console.error('Error fetching business:', error);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (formData.phone_number && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL starting with http:// or https://';
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
      
      if (isEditing) {
        await businessAPI.update(id, formData);
      } else {
        await businessAPI.create(formData);
      }

      navigate('/businesses');
    } catch (error) {
      console.error('Error saving business:', error);
      setErrors({ submit: 'Failed to save business. Please try again.' });
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
          onClick={() => navigate('/businesses')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Businesses
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Business' : 'Add New Business'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update business information' : 'Add a new business partner to your system'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Business Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter business name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Username */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.username ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.phone_number ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter phone number (optional)"
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Enter phone number with country code (e.g., +1 555 123 4567)
            </p>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter business address (optional)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the business physical address
            </p>
          </div>

          {/* Website */}
          <div className="mb-6">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.website ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Enter the business website URL (optional)
            </p>
          </div>

          {/* Logo URL */}
          <div className="mb-6">
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="https://example.com/logo.png"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a URL to the business logo image (optional)
            </p>
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
              onClick={() => navigate('/businesses')}
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
              {loading ? 'Saving...' : (isEditing ? 'Update Business' : 'Create Business')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BusinessForm;
