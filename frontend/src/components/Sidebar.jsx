import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, BarChart3, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'POS Billing', path: '/pos', icon: ShoppingCart },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col hidden md:flex">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="text-blue-500" />
          SuperStore POS
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-medium">Current User</p>
            <p className="text-xs text-gray-400">Role</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
