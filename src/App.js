import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Businesses from './pages/Businesses';
import ProductForm from './components/ProductForm';
import CategoryForm from './components/CategoryForm';
import CustomerForm from './components/CustomerForm';
import OrderForm from './components/OrderForm';
import PaymentForm from './components/PaymentForm';
import BusinessForm from './components/BusinessForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/new" element={<CategoryForm />} />
              <Route path="/categories/edit/:id" element={<CategoryForm />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/edit/:id" element={<CustomerForm />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/new" element={<OrderForm />} />
              <Route path="/orders/edit/:id" element={<OrderForm />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payments/new" element={<PaymentForm />} />
              <Route path="/payments/edit/:id" element={<PaymentForm />} />
              <Route path="/businesses" element={<Businesses />} />
              <Route path="/businesses/new" element={<BusinessForm />} />
              <Route path="/businesses/edit/:id" element={<BusinessForm />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
