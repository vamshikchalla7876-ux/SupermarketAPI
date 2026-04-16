import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

export default App;
