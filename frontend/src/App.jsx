import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';
  const isPosPage = location.pathname === '/pos';

  // For POS, we want a full-screen app without the standard sidebar
  // to maximize screen real estate and minimize distractions
  if (isLoginPage) {
    return <Outlet />;
  }

  if (isPosPage) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
