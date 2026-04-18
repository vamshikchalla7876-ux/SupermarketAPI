import React, { useState } from 'react';
import { Users, Shield, Settings as SettingsIcon, Save, Plus } from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@superstore.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john@superstore.com', role: 'Cashier', status: 'Active' },
    { id: 3, name: 'Sarah Miller', email: 'sarah@superstore.com', role: 'Supervisor', status: 'Active' },
    { id: 4, name: 'Mike Thomas', email: 'mike@superstore.com', role: 'Inventory Manager', status: 'Inactive' },
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
        <p className="text-gray-500 mt-1">Manage users, roles, and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Users & Roles */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900">User Management</h2>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium">
                <Plus size={16} />
                Add User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.status === 'Active' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className="ml-2 text-sm text-gray-500 align-top">{user.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-900">Edit</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <Shield className="text-purple-500" />
              <h2 className="text-lg font-bold text-gray-900">Security & Audit Logs</h2>
            </div>
            <div className="p-0">
              <div className="divide-y divide-gray-100">
                <div className="p-4 flex gap-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-500 whitespace-nowrap">10:45 AM</div>
                  <div>
                    <p className="text-sm text-gray-900">Supervisor override for Transaction TRX-9824</p>
                    <p className="text-xs text-gray-500">By Sarah Miller</p>
                  </div>
                </div>
                <div className="p-4 flex gap-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-500 whitespace-nowrap">09:15 AM</div>
                  <div>
                    <p className="text-sm text-gray-900">New user account created (Mike Thomas)</p>
                    <p className="text-xs text-gray-500">By Admin User</p>
                  </div>
                </div>
                <div className="p-4 flex gap-4 hover:bg-gray-50">
                  <div className="text-sm text-gray-500 whitespace-nowrap">08:00 AM</div>
                  <div>
                    <p className="text-sm text-gray-900">System backup completed successfully</p>
                    <p className="text-xs text-gray-500">System Auto</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="text-sm text-blue-600 font-medium hover:text-blue-800">View Full Logs</button>
            </div>
          </div>
        </div>

        {/* Right Column - Store Settings */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center gap-2">
              <SettingsIcon className="text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">Store Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input type="text" defaultValue="SuperStore Main Branch" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option>₹ (INR)</option>
                  <option>$ (USD)</option>
                  <option>€ (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (GST %)</label>
                <input type="number" defaultValue="5" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  <Save size={18} />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
