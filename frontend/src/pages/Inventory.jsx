import React, { useState } from 'react';
import { Package, AlertTriangle, ArrowDownToLine, Plus, Search, Filter } from 'lucide-react';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock inventory data
  const inventory = [
    { id: 1, name: 'Parle-G Gold 1kg', sku: 'BIS-001', barcode: '1001', category: 'Groceries', price: 120.00, stock: 150, status: 'In Stock' },
    { id: 2, name: 'Tata Salt 1kg', sku: 'GRO-002', barcode: '1002', category: 'Groceries', price: 28.00, stock: 450, status: 'In Stock' },
    { id: 3, name: 'Amul Butter 500g', sku: 'DAI-001', barcode: '1003', category: 'Dairy', price: 285.00, stock: 12, status: 'Low Stock' },
    { id: 4, name: 'Maggi 2-Minute Noodles 140g', sku: 'SNA-005', barcode: '1004', category: 'Snacks', price: 30.00, stock: 8, status: 'Low Stock' },
    { id: 5, name: 'Aashirvaad Atta 5kg', sku: 'GRO-010', barcode: '1005', category: 'Groceries', price: 245.00, stock: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Manage products, pricing, and stock levels</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <ArrowDownToLine size={20} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">1,248</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Items</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-900">5</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Categories</p>
            <p className="text-2xl font-bold text-gray-900">18</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none sm:text-sm"
              placeholder="Search by name, SKU, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU / Barcode</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.sku}</div>
                    <div className="text-xs text-gray-500 font-mono">{item.barcode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                      item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination stub */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">1,248</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
