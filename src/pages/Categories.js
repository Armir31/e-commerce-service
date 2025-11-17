import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Tag } from 'lucide-react';
import { categoryAPI } from '../services/api';
import { formatDate, truncateText } from '../utils';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      try {
        await categoryAPI.delete(id);
        setCategories(categories.filter(category => category.id !== id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'products':
        return (b.product ? 1 : 0) - (a.product ? 1 : 0);
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
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Link
          to="/categories/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
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
            <option value="date">Sort by Date</option>
            <option value="products">Sort by Products</option>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-primary-100">
                    <Tag className="h-6 w-6 text-primary-600" />
                  </div>
                  <span className="ml-3 text-sm text-gray-500">#{category.id}</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/categories/edit/${category.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {category.name}
              </h3>
              
              {category.description && (
                <p className="text-gray-600 mb-4">
                  {truncateText(category.description, 120)}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {formatDate(category.createdAt)}</span>
                <span>Updated: {formatDate(category.updatedAt)}</span>
              </div>
              
              {category.product && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sample Product:</span> {category.product.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Tag className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by adding your first category.'
            }
          </p>
          {!searchTerm && (
            <Link
              to="/categories/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
