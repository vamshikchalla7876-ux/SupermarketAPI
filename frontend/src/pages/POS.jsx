import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote as CashIcon, ArrowLeft } from 'lucide-react';

export default function POS() {
  const navigate = useNavigate();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState([]);
  const barcodeRef = useRef(null);

  // Focus barcode input on mount and keep it focused
  useEffect(() => {
    barcodeRef.current?.focus();
    const handleGlobalClick = () => {
      // Small timeout to allow other inputs to be clicked
      setTimeout(() => {
        if (document.activeElement.tagName !== 'INPUT') {
          barcodeRef.current?.focus();
        }
      }, 100);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Mock product database
  const products = {
    '1001': { id: 1, name: 'Parle-G Gold 1kg', price: 120.00, barcode: '1001' },
    '1002': { id: 2, name: 'Tata Salt 1kg', price: 28.00, barcode: '1002' },
    '1003': { id: 3, name: 'Amul Butter 500g', price: 285.00, barcode: '1003' },
    '1004': { id: 4, name: 'Maggi 2-Minute Noodles 140g', price: 30.00, barcode: '1004' },
    '1005': { id: 5, name: 'Aashirvaad Atta 5kg', price: 245.00, barcode: '1005' },
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (!barcodeInput) return;

    const product = products[barcodeInput];
    if (product) {
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });
    } else {
      // Flash error or show toast for invalid barcode
      console.log('Product not found');
    }
    setBarcodeInput('');
    barcodeRef.current?.focus();
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
    barcodeRef.current?.focus();
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    barcodeRef.current?.focus();
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05; // 5% GST mock
  const total = subtotal + tax;

  const handleCompleteSale = (method) => {
    if (cart.length === 0) return;
    alert(`Sale completed with ${method}! Total: ₹${total.toFixed(2)}`);
    setCart([]);
    barcodeRef.current?.focus();
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Main POS Area */}
      <div className="flex-1 flex flex-col h-full border-r border-gray-200 bg-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
          </div>
          <div className="text-sm text-gray-400">
            Cashier: <span className="text-white font-medium">Demo User</span> | Register: 01
          </div>
        </div>

        {/* Barcode Scanner Input Form */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleScan} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              ref={barcodeRef}
              type="text"
              className="block w-full pl-12 pr-4 py-4 text-xl border-2 border-blue-400 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Scan Barcode or Enter SKU... (Try 1001-1005)"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              autoFocus
            />
          </form>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <Search size={64} className="text-gray-300" />
              <p className="text-xl font-medium">Scan an item to begin</p>
              <div className="text-sm text-center">
                <p>Try scanning these barcodes:</p>
                <div className="flex gap-2 mt-2">
                  {['1001', '1002', '1003', '1004', '1005'].map(code => (
                    <span key={code} className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">{code}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Item</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              {cart.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-4 py-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="col-span-1 text-gray-400 font-medium">{index + 1}</div>
                  <div className="col-span-5">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                    <p className="text-sm text-gray-500 font-mono mt-1">{item.barcode}</p>
                  </div>
                  <div className="col-span-2 text-right font-medium text-gray-700">
                    ₹{item.price.toFixed(2)}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-10 text-center font-bold text-lg">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end items-center gap-4">
                    <span className="font-bold text-lg text-gray-900">₹{(item.price * item.qty).toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Summary & Payment */}
      <div className="w-[400px] flex flex-col bg-gray-50 shadow-xl z-20">
        <div className="flex-1 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Current Bill Summary</h2>

          <div className="space-y-4 mb-8 text-lg">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (5%)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium pt-4 border-t border-dashed border-gray-300">
              <span>Total Discount</span>
              <span>-₹0.00</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
              <div className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-1">Total Amount</div>
              <div className="text-5xl font-black text-gray-900 tracking-tight">
                ₹{total.toFixed(2)}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleCompleteSale('Cash')}
                disabled={cart.length === 0}
                className="w-full flex items-center justify-center gap-3 py-5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-xl transition-all shadow-md active:scale-95"
              >
                Cash Payment
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCompleteSale('Card')}
                  disabled={cart.length === 0}
                  className="flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-lg transition-all shadow-md active:scale-95"
                >
                  <CreditCard size={24} />
                  Card
                </button>
                <button
                  onClick={() => handleCompleteSale('UPI')}
                  disabled={cart.length === 0}
                  className="flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-lg transition-all shadow-md active:scale-95"
                >
                  UPI / QR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
