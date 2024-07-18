// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Transaction from './components/Transaction';
import Cashbook from './components/Cashbook';
import Navbar from './components/Navbar';
import Loading from './Loading';
import Footer from './components/Footer';
import './App.css'; // Import the CSS file

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay (e.g., API calls, data fetching)
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Adjust time as needed for your app
    }, []);

    return (
        <div className="app">
            <Router>
                <Navbar />
                <div className="content">
                    {loading ? (
                        <Loading />
                    ) : (
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/transactions" element={<Transaction />} />
                            <Route path="/cashbook" element={<Cashbook />} />
                        </Routes>
                    )}
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
