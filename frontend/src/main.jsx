import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'pos',
        element: <POS />,
      },
      {
        path: 'inventory',
        element: <Inventory />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'admin',
        element: <Admin />,
      },
      // Redirect legacy dashboard route
      {
        path: 'dashboard',
        element: <Navigate to="/inventory" replace />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
