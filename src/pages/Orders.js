import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate, getOrderStatusColor } from '../utils';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await orderAPI.delete(id);
        setOrders(orders.filter(order => order.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.costumer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.costumer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.costumer?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'amount':
        return (b.total_amount || 0) - (a.total_amount || 0);
      case 'status':
        return (a.order_status || '').localeCompare(b.order_status || '');
      case 'customer':
        return `${a.costumer?.first_name || ''} ${a.costumer?.last_name || ''}`.localeCompare(
          `${b.costumer?.first_name || ''} ${b.costumer?.last_name || ''}`
        );
      default:
        return 0;
    }
  });

  const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and track their status</p>
        </div>
        <Link
          to="/orders/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
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
            <option value="customer">Sort by Customer</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setSortBy('date');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {sortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.order_number || 'No order number'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.costumer?.first_name} {order.costumer?.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.costumer?.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/orders/edit/${order.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id)}
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

      {sortedOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingBag className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first order.'
            }
          </p>
          {!searchTerm && !statusFilter && (
            <Link
              to="/orders/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Link>
          )}
        </div>
      )}

      {/* Order Statistics */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {orderStatuses.map((status) => {
            const count = orders.filter(order => order.order_status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <ShoppingBag className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{status}</p>
                    <p className="text-2xl font-semibold text-gray-900">{count}</p>
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

export default Orders;
