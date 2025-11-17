import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { productAPI, categoryAPI, businessAPI } from '../services/api';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    quantity: '',
    category_id: '',
    business_id: ''
  });

  // Debug logging for form data changes
  useEffect(() => {
    if (isEditing) {
      console.log('Form data updated:', formData);
    }
  }, [formData, isEditing]);

  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchBusinesses();
    if (isEditing) {
      fetchProduct();
    }
    
    // Cleanup function to reset form when component unmounts or id changes
    return () => {
      setFormData({
        name: '',
        description: '',
        image: '',
        price: '',
        quantity: '',
        category_id: '',
        business_id: ''
      });
      setErrors({});
    };
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await businessAPI.getAll();
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      const product = response.data;
      
      // Ensure we only use the ID fields, not the nested objects
      // Prioritize direct ID fields over nested object IDs
      const categoryId = product.category_id || product.category?.id;
      const businessId = product.business_id || product.business?.id;
      
      console.log('Fetched product data:', {
        category_id: product.category_id,
        category: product.category,
        business_id: product.business_id,
        business: product.business
      });
      
      console.log('Resolved IDs:', { categoryId, businessId });
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        image: product.image || '',
        price: product.price?.toString() || '',
        quantity: product.quantity?.toString() || '',
        category_id: categoryId?.toString() || '',
        business_id: businessId?.toString() || ''
      });
    } catch (error) {
      console.error('Error fetching product:', error);
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
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.category_id || isNaN(parseInt(formData.category_id))) {
      newErrors.category_id = 'Valid category is required';
    }

    if (!isEditing && (!formData.business_id || isNaN(parseInt(formData.business_id)))) {
      newErrors.business_id = 'Valid business is required';
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
      
      // Only send the necessary fields to avoid ID conflicts
      const categoryId = parseInt(formData.category_id);
      const businessId = parseInt(formData.business_id);
      
      // Additional validation to ensure IDs are valid
      if (isNaN(categoryId) || (!isEditing && isNaN(businessId))) {
        setErrors({ submit: 'Invalid category or business ID. Please try again.' });
        return;
      }
      
      const submitData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        price: formData.price.toString(),
        quantity: parseInt(formData.quantity),
        category_id: categoryId,
        // Only include business_id when creating new products, not when editing
        ...(isEditing ? {} : { business_id: businessId })
      };
      
      console.log('Submitting product data:', submitData);

      if (isEditing) {
        console.log(`Updating product ${id} with data:`, submitData);
        await productAPI.update(id, submitData);
      } else {
        console.log('Creating new product with data:', submitData);
        await productAPI.create(submitData);
      }

      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Handle specific backend errors
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('Identifier of an instance') || errorMessage.includes('was altered')) {
          setErrors({ submit: 'Category or Business ID conflict detected. Please refresh and try again.' });
          // Refresh product data to resolve ID conflicts
          if (isEditing) {
            await fetchProduct();
          }
        } else {
          setErrors({ submit: errorMessage });
        }
      } else {
        setErrors({ submit: 'Failed to save product. Please try again.' });
      }
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
          onClick={() => navigate('/products')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update product information' : 'Create a new product for your catalog'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Product Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
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
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a valid image URL or leave blank for placeholder
            </p>
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.category_id ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
            )}
          </div>

          {/* Business */}
          <div className="mb-6">
            <label htmlFor="business_id" className="block text-sm font-medium text-gray-700 mb-2">
              Business {isEditing ? '' : '*'}
            </label>
            {isEditing ? (
              <div className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 sm:text-sm">
                <div className="flex items-center justify-between">
                  <span>{businesses.find(b => b.id.toString() === formData.business_id)?.name || 'Unknown Business'}</span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Business cannot be changed after product creation
                </p>
              </div>
            ) : (
              <>
                <select
                  id="business_id"
                  name="business_id"
                  value={formData.business_id}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.business_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a business</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
                {errors.business_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.business_id}</p>
                )}
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
            {isEditing && (
              <button
                type="button"
                onClick={fetchProduct}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/products')}
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
              {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
