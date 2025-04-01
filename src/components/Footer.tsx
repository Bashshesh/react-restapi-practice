import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='footer'>
            <h1>Footer</h1>
            <p>© 2023 My App. All rights reserved.</p>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
            </nav>

        </div>
    )
};

export default Footer; 