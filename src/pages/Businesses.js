import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Building2, Globe, Phone, Mail } from 'lucide-react';
import { businessAPI } from '../services/api';
import { formatDate, truncateText } from '../utils';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await businessAPI.getAll();
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this business? This will affect all related orders.')) {
      try {
        await businessAPI.delete(id);
        setBusinesses(businesses.filter(business => business.id !== id));
      } catch (error) {
        console.error('Error deleting business:', error);
      }
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
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
          <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
          <p className="text-gray-600">Manage business accounts and partnerships</p>
        </div>
        <Link
          to="/businesses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Business
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
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
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBusinesses.map((business) => (
          <div key={business.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-primary-100">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className="ml-3 text-sm text-gray-500">#{business.id}</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/businesses/edit/${business.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(business.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {business.name}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Username:</span>
                  <span className="ml-2">{business.username}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{business.email}</span>
                </div>
                
                {business.phone_number && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{business.phone_number}</span>
                  </div>
                )}
                
                {business.address && (
                  <div className="flex items-start text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <span className="font-medium">Address:</span>
                    <span className="ml-2">{truncateText(business.address, 50)}</span>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Website:</span>
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary-600 hover:text-primary-500"
                    >
                      {truncateText(business.website, 30)}
                    </a>
                  </div>
                )}
              </div>
              
              {business.logo && (
                <div className="mb-4">
                  <img
                    src={business.logo}
                    alt={`${business.name} logo`}
                    className="h-16 w-16 object-contain rounded border border-gray-200"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {formatDate(business.createdAt)}</span>
                <span>Updated: {formatDate(business.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedBusinesses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Building2 className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by adding your first business partner.'
            }
          </p>
          {!searchTerm && (
            <Link
              to="/businesses/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Businesses;
