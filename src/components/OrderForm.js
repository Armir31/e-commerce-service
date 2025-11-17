import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { orderAPI, customerAPI, productAPI } from '../services/api';
import { formatPrice } from '../utils';

const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    costumer_id: '',
    order_items: []
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    if (isEditing) {
      fetchOrder();
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(id);
      const order = response.data;
      setFormData({
        costumer_id: order.costumer?.id?.toString() || '',
        order_items: order.order_items?.map(item => ({
          product_id: item.product_id?.toString() || '',
          quantity: item.quantity?.toString() || '1'
        })) || []
      });
    } catch (error) {
      console.error('Error fetching order:', error);
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      order_items: [...prev.order_items, { product_id: '', quantity: '1' }]
    }));
  };

  const removeOrderItem = (index) => {
    setFormData(prev => ({
      ...prev,
      order_items: prev.order_items.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      order_items: prev.order_items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.costumer_id) {
      newErrors.costumer_id = 'Customer is required';
    }

    if (formData.order_items.length === 0) {
      newErrors.order_items = 'At least one product is required';
    } else {
      formData.order_items.forEach((item, index) => {
        if (!item.product_id) {
          newErrors[`order_items.${index}.product_id`] = 'Product is required';
        }
        if (!item.quantity || parseInt(item.quantity) <= 0) {
          newErrors[`order_items.${index}.quantity`] = 'Valid quantity is required';
        }
      });
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
      
      const submitData = {
        ...formData,
        costumer_id: parseInt(formData.costumer_id),
        order_items: formData.order_items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity)
        }))
      };

      if (isEditing) {
        await orderAPI.update(id, submitData);
      } else {
        await orderAPI.create(submitData);
      }

      navigate('/orders');
    } catch (error) {
      console.error('Error saving order:', error);
      setErrors({ submit: 'Failed to save order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.order_items.reduce((total, item) => {
      const product = products.find(p => p.id.toString() === item.product_id);
      if (product && item.quantity) {
        return total + (parseFloat(product.price) * parseInt(item.quantity));
      }
      return total;
    }, 0);
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Order' : 'Create New Order'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update order information' : 'Create a new order for a customer'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Customer Selection */}
          <div className="mb-6">
            <label htmlFor="costumer_id" className="block text-sm font-medium text-gray-700 mb-2">
              Customer *
            </label>
            <select
              id="costumer_id"
              name="costumer_id"
              value={formData.costumer_id}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.costumer_id ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name} ({customer.username})
                </option>
              ))}
            </select>
            {errors.costumer_id && (
              <p className="mt-1 text-sm text-red-600">{errors.costumer_id}</p>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Order Items *
              </label>
              <button
                type="button"
                onClick={addOrderItem}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </button>
            </div>

            {formData.order_items.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No products added yet</p>
                <p className="text-sm text-gray-400">Click "Add Product" to get started</p>
              </div>
            )}

            {formData.order_items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product *
                    </label>
                    <select
                      value={item.product_id}
                      onChange={(e) => updateOrderItem(index, 'product_id', e.target.value)}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors[`order_items.${index}.product_id`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {formatPrice(product.price)}
                        </option>
                      ))}
                    </select>
                    {errors[`order_items.${index}.product_id`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`order_items.${index}.product_id`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors[`orderItems.${index}.quantity`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`orderItems.${index}.quantity`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`orderItems.${index}.quantity`]}</p>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeOrderItem(index)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>

                {item.product_id && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Unit Price: {formatPrice(products.find(p => p.id.toString() === item.product_id)?.price || 0)}
                      </span>
                      <span className="text-gray-600">
                        Subtotal: {formatPrice(
                          (products.find(p => p.id.toString() === item.product_id)?.price || 0) * parseInt(item.quantity || 0)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {errors.order_items && (
              <p className="mt-1 text-sm text-red-600">{errors.order_items}</p>
            )}
          </div>

          {/* Order Total */}
          {formData.order_items.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Order Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          )}

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
              onClick={() => navigate('/orders')}
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
              {loading ? 'Saving...' : (isEditing ? 'Update Order' : 'Create Order')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
