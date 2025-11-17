import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';
import { productAPI, customerAPI, orderAPI, paymentAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils';
import ConnectionStatus from '../components/ConnectionStatus';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalPayments: 0,
    recentOrders: [],
    topProducts: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [products, customers, orders, payments] = await Promise.all([
          productAPI.getAll(),
          customerAPI.getAll(),
          orderAPI.getAll(),
          paymentAPI.getAll()
        ]);

        setStats({
          totalProducts: products.data.length,
          totalCustomers: customers.data.length,
          totalOrders: orders.data.length,
          totalPayments: payments.data.length,
          recentOrders: orders.data.slice(0, 5),
          topProducts: products.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-primary-100">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          {changeType === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`ml-2 text-sm ${
            changeType === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your e-commerce dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          change="+12%"
          changeType="up"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          change="+8%"
          changeType="up"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          change="+15%"
          changeType="up"
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={CreditCard}
          change="+5%"
          changeType="up"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.costumer?.first_name} {order.costumer?.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.order_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.order_status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                      order.order_status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                      order.order_status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            to="/orders"
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View all orders →
          </Link>
        </div>
      </div>

              {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/products/new"
                className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Add New Product
              </Link>
              <Link
                to="/orders/new"
                className="block w-full text-center bg-secondary-600 text-white px-4 py-2 rounded-md hover:bg-secondary-700 transition-colors"
              >
                Create Order
              </Link>
              <Link
                to="/customers/new"
                className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Customer
              </Link>
            </div>
          </div>

          <ConnectionStatus />

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm text-gray-900">{formatDate(new Date())}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              New order received
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Package className="h-4 w-4 mr-2 text-blue-500" />
              Product updated
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              Customer registered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
