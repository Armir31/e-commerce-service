import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Tag, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Building2,
  BarChart3,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/categories', icon: Tag },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Businesses', href: '/businesses', icon: Building2 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-6 h-6 mr-3 ${
                    isActive ? 'text-primary-500' : 'text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
