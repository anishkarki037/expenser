// Cashbook.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDownload, FaBalanceScale } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const Cashbook = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [editTransaction, setEditTransaction] = useState(null);
    const [message, setMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [balance, setBalance] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearlyBalanceSheet, setYearlyBalanceSheet] = useState({});
    const [showYearlyModal, setShowYearlyModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/transactions')
            .then(response => {
                setTransactions(response.data);
                setFilteredTransactions(response.data);
                calculateBalance(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/transactions/${id}`)
            .then(() => {
                const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
                setTransactions(updatedTransactions);
                setFilteredTransactions(updatedTransactions);
                calculateBalance(updatedTransactions);
                setMessage('Transaction deleted successfully');
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(error => console.error(error));
    };

    const openEditModal = (transaction) => {
        setEditTransaction(transaction);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setEditTransaction(null);
        setShowEditModal(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const { id, description, amount, date, type } = editTransaction;
        axios.put(`http://localhost:5000/api/transactions/${id}`, { description, amount, date, type })
            .then(() => {
                const updatedTransactions = transactions.map(transaction =>
                    transaction.id === id ? { ...editTransaction } : transaction
                );
                setTransactions(updatedTransactions);
                setFilteredTransactions(updatedTransactions);
                calculateBalance(updatedTransactions);
                closeEditModal();
                setMessage('Transaction updated successfully');
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(error => console.error(error));
    };

    const applyFilter = () => {
        let filteredData = transactions;
        const now = new Date();
        switch (filter) {
            case 'week':
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                filteredData = transactions.filter(transaction => new Date(transaction.date) >= oneWeekAgo);
                break;
            case 'month':
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(now.getMonth() - 1);
                filteredData = transactions.filter(transaction => new Date(transaction.date) >= oneMonthAgo);
                break;
            case 'threeMonths':
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(now.getMonth() - 3);
                filteredData = transactions.filter(transaction => new Date(transaction.date) >= threeMonthsAgo);
                break;
            case 'custom':
                if (customStartDate && customEndDate) {
                    const startDate = new Date(customStartDate);
                    const endDate = new Date(customEndDate);
                    filteredData = transactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date);
                        return transactionDate >= startDate && transactionDate <= endDate;
                    });
                }
                break;
            default:
                break;
        }
        setFilteredTransactions(filteredData);
        calculateBalance(filteredData);
    };

    const calculateBalance = (transactions) => {
        const totalBalance = transactions.reduce((acc, transaction) => {
            return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
        setBalance(totalBalance);
    };

    useEffect(() => {
        applyFilter();
    }, [filter, customStartDate, customEndDate, transactions]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const searchedTransactions = transactions.filter(transaction =>
            transaction.description.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredTransactions(searchedTransactions);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTransactions);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        XLSX.writeFile(workbook, 'transactions.xlsx');
    };

    const createYearlyBalanceSheet = () => {
        const currentYear = new Date().getFullYear();
        const yearlyTransactions = transactions.filter(transaction => {
            const transactionYear = new Date(transaction.date).getFullYear();
            return transactionYear === currentYear;
        });

        const income = yearlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = yearlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const yearlyBalance = income - expense;

        setYearlyBalanceSheet({
            year: currentYear,
            income,
            expense,
            balance: yearlyBalance
        });

        setShowYearlyModal(true);
    };

    const downloadYearlyBalanceSheet = () => {
        const worksheet = XLSX.utils.json_to_sheet([yearlyBalanceSheet]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Yearly Balance Sheet');
        XLSX.writeFile(workbook, `yearly_balance_sheet_${yearlyBalanceSheet.year}.xlsx`);
    };

    return (
        <div className="container ">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="d-flex align-items-center">
                    Cashbook
                </h1>
                <div>
                    <FaDownload className="me-3 cursor-pointer" onClick={exportToExcel} />
                    <FaBalanceScale className="cursor-pointer" onClick={createYearlyBalanceSheet} />
                </div>
            </div>
            {message && <p className="alert alert-success">{message}</p>}
            
            {/* Filter, Search, and Balance Section */}
            <div className="d-flex justify-content-between mb-4">
                <div className="d-flex align-items-center">
                    <div className="me-3">
                        <label htmlFor="filter" className="form-label">Filter by:</label>
                        <select
                            id="filter"
                            className="form-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="week">Last Week</option>
                            <option value="month">Last 30 Days</option>
                            <option value="threeMonths">Last 3 Months</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    
                    {filter === 'custom' && (
                        <div className="d-flex">
                            <div className="me-2">
                                <label htmlFor="customStartDate" className="form-label">Start Date:</label>
                                <input
                                    type="date"
                                    id="customStartDate"
                                    className="form-control"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="customEndDate" className="form-label">End Date:</label>
                                <input
                                    type="date"
                                    id="customEndDate"
                                    className="form-control"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="ms-3">
                        <label htmlFor="searchTerm" className="form-label">Search by Remarks:</label>
                        <input
                            type="text"
                            id="searchTerm"
                            className="form-control"
                            placeholder="Search remarks"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div>
                    <h4>Balance: Nrs. <strong>{balance.toFixed(2)}</strong></h4>
                </div>
            </div>
            
            {/* Transactions Table */}
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (Nrs.)</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.description}</td>
                                <td>{transaction.amount}</td>
                                <td>{formatDate(transaction.date)}</td>
                                <td>{transaction.type}</td>
                                <td>
                                    <button className="btn btn-primary me-2" onClick={() => openEditModal(transaction)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(transaction.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Transaction Modal */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Transaction</h5>
                                <button type="button" className="btn-close" onClick={closeEditModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description:</label>
                                        <input
                                            type="text"
                                            id="description"
                                            className="form-control"
                                            value={editTransaction.description}
                                            onChange={(e) => setEditTransaction({ ...editTransaction, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="amount" className="form-label">Amount:</label>
                                        <input
                                            type="number"
                                            id="amount"
                                            className="form-control"
                                            value={editTransaction.amount}
                                            onChange={(e) => setEditTransaction({ ...editTransaction, amount: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label">Date:</label>
                                        <input
                                            type="date"
                                            id="date"
                                            className="form-control"
                                            value={editTransaction.date}
                                            onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="type" className="form-label">Type:</label>
                                        <select
                                            id="type"
                                            className="form-select"
                                            value={editTransaction.type}
                                            onChange={(e) => setEditTransaction({ ...editTransaction, type: e.target.value })}
                                            required
                                        >
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Yearly Balance Sheet Modal */}
            {showYearlyModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Yearly Balance Sheet</h5>
                                <button type="button" className="btn-close" onClick={() => setShowYearlyModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Year:</strong> {yearlyBalanceSheet.year}</p>
                                <p><strong>Total Income:</strong> Nrs. {yearlyBalanceSheet.income}</p>
                                <p><strong>Total Expense:</strong> Nrs. {yearlyBalanceSheet.expense}</p>
                                <p><strong>Balance:</strong> Nrs. {yearlyBalanceSheet.balance}</p>
                                <button className="btn btn-success" onClick={downloadYearlyBalanceSheet}>Download</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cashbook;
