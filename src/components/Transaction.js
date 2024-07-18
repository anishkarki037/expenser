// Transaction.js
import React, { useState } from 'react';
import axios from 'axios';

const Transaction = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('income');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const transaction = { description, amount, date, type };

        axios.post('http://localhost:5000/api/transactions', transaction)
            .then(() => {
                setDescription('');
                setAmount('');
                setDate('');
                setType('income');
                setMessage('Transaction added successfully');
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="container mt-5">
            <h1>Add Transaction</h1>
            {message && <p className="alert alert-success">{message}</p>}
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                        type="text"
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select
                        id="type"
                        className="form-control"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Add Transaction</button>
                </div>
            </form>
        </div>
    );
};

export default Transaction;
