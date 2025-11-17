import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { productAPI, categoryAPI, businessAPI } from '../services/api';
import { formatPrice, formatDate, truncateText } from '../utils';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBusinesses();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.id === parseInt(selectedCategory);
    const matchesBusiness = !selectedBusiness || product.business?.id === parseInt(selectedBusiness);
    return matchesSearch && matchesCategory && matchesBusiness;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'quantity':
        return a.quantity - b.quantity;
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
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Businesses</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="date">Sort by Date</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedBusiness('');
              setSortBy('name');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-1 aspect-h-1 w-full">
              <img
                src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {product.business?.name || 'No Business'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">#{product.id}</span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {truncateText(product.name, 30)}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">
                {truncateText(product.description, 80)}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className={`text-sm font-medium ${
                  product.quantity > 10 ? 'text-green-600' : 
                  product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.quantity} in stock
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  to={`/products/edit/${product.id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(product.createdAt)}</span>
                  <span>Updated: {formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first product.'
            }
          </p>
          {!searchTerm && !selectedCategory && (
            <Link
              to="/products/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
