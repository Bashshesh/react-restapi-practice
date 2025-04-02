import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">
      <h1>Welcome to My App</h1>
      <p>This is a simple application</p>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;