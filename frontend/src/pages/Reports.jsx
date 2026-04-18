import React from 'react';
import { BarChart3, TrendingUp, CreditCard, Users, Download, Calendar } from 'lucide-react';

export default function Reports() {
  // Mock transactions
  const transactions = [
    { id: 'TRX-9821', time: '10:42 AM', cashier: 'John D.', items: 12, total: 1450.00, method: 'UPI', status: 'Completed' },
    { id: 'TRX-9822', time: '10:45 AM', cashier: 'Sarah M.', items: 3, total: 340.50, method: 'Cash', status: 'Completed' },
    { id: 'TRX-9823', time: '10:51 AM', cashier: 'John D.', items: 24, total: 4210.00, method: 'Card', status: 'Completed' },
    { id: 'TRX-9824', time: '11:05 AM', cashier: 'Sarah M.', items: 5, total: 850.00, method: 'UPI', status: 'Refunded' },
    { id: 'TRX-9825', time: '11:12 AM', cashier: 'Mike T.', items: 1, total: 45.00, method: 'Cash', status: 'Completed' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Today's overview and recent transactions</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg">
            <Calendar size={18} className="text-gray-400" />
            <span className="font-medium">Today</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              +12.5%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Sales (Today)</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">₹42,500</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <CreditCard size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Transactions</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">142</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <BarChart3 size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Average Order Value</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">₹299.30</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Users size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Active Cashiers</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">4</h3>
        </div>
      </div>

      {/* Payment Methods Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">UPI</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Card</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Cash</span>
                <span className="font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cashier</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 relative"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{trx.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trx.cashier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{trx.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{trx.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-gray-400 hover:text-gray-900">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
