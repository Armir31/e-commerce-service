import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, User, Mail, Phone, MapPin } from 'lucide-react';
import { customerAPI } from '../services/api';
import { formatDate, truncateText } from '../utils';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This will affect all their orders.')) {
      try {
        await customerAPI.delete(id);
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number?.includes(searchTerm)
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      case 'username':
        return (a.username || '').localeCompare(b.username || '');
      case 'email':
        return (a.email || '').localeCompare(b.email || '');
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <Link
          to="/customers/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="username">Sort by Username</option>
            <option value="email">Sort by Email</option>
            <option value="date">Sort by Date</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSortBy('name');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-primary-100">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className="ml-3 text-sm text-gray-500">#{customer.id}</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/customers/edit/${customer.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {customer.first_name} {customer.last_name}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Username:</span>
                  <span className="ml-2">{customer.username}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{customer.email}</span>
                </div>
                
                {customer.phone_number && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{customer.phone_number}</span>
                  </div>
                )}
                
                {customer.address && (
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <span className="font-medium">Address:</span>
                    <span className="ml-2">{truncateText(customer.address, 50)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {formatDate(customer.createdAt)}</span>
                <span>Updated: {formatDate(customer.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by adding your first customer.'
            }
          </p>
          {!searchTerm && (
            <Link
              to="/customers/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Customers;
