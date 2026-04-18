import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Users, Package, Settings, BarChart3 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin') navigate('/admin');
    else if (username === 'manager') navigate('/inventory');
    else navigate('/pos');
  };

  const handleDemoLogin = (role) => {
    switch (role) {
      case 'cashier':
        navigate('/pos');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'supervisor':
        navigate('/reports');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <div className="flex justify-center mb-2">
            <ShoppingCart className="text-white h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-white">SuperStore POS</h1>
          <p className="text-blue-100 mt-1">Retail Management System</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Demo Login</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('cashier')}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-500 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 text-blue-500" />
                Cashier
              </button>
              <button
                onClick={() => handleDemoLogin('inventory')}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-green-500 transition-colors"
              >
                <Package className="w-4 h-4 text-green-500" />
                Inventory
              </button>
              <button
                onClick={() => handleDemoLogin('supervisor')}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-purple-500 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-purple-500" />
                Supervisor
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-red-500 transition-colors"
              >
                <Settings className="w-4 h-4 text-red-500" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>System Version 2.4.1 • Contact Support for access</p>
      </div>
    </div>
  );
}
