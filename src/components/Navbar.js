// Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/expenser.png';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg ">
            <div className="container flex-nav">
                <Link className="navbar-brand" to="/">
                    {/* <img src={logo} alt="Expenser Logo" style={{ height: '40px', marginRight: '10px' }} /> */}
                    <strong><h1><span style={{color: '#069FCE'}}>BlueBug</span> Expen$er</h1></strong>
                    
                </Link>
                <div className="">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/transactions">Transactions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cashbook">Cashbook</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
