// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [weeklyData, setWeeklyData] = useState({ income: 0, expenses: 0 });
    const [monthlyData, setMonthlyData] = useState({ income: 0, expenses: 0 });
    const [quarterlyData, setQuarterlyData] = useState({ income: 0, expenses: 0 });
    const [semiAnnualData, setSemiAnnualData] = useState({ income: 0, expenses: 0 });
    const [yearlyData, setYearlyData] = useState({ income: 0, expenses: 0 });

    useEffect(() => {
        axios.get('http://localhost:5000/api/transactions')
            .then(response => {
                const transactions = response.data;

                // Calculate weekly totals
                const weeklyTransactions = filterTransactionsByDateRange(transactions, 'week');
                const weeklyIncome = calculateTotalByType(weeklyTransactions, 'income');
                const weeklyExpenses = calculateTotalByType(weeklyTransactions, 'expense');
                setWeeklyData({ income: weeklyIncome, expenses: weeklyExpenses });

                // Calculate monthly totals
                const monthlyTransactions = filterTransactionsByDateRange(transactions, 'month');
                const monthlyIncome = calculateTotalByType(monthlyTransactions, 'income');
                const monthlyExpenses = calculateTotalByType(monthlyTransactions, 'expense');
                setMonthlyData({ income: monthlyIncome, expenses: monthlyExpenses });

                // Calculate quarterly totals
                const quarterlyTransactions = filterTransactionsByDateRange(transactions, 'quarter');
                const quarterlyIncome = calculateTotalByType(quarterlyTransactions, 'income');
                const quarterlyExpenses = calculateTotalByType(quarterlyTransactions, 'expense');
                setQuarterlyData({ income: quarterlyIncome, expenses: quarterlyExpenses });

                // Calculate semi-annual totals
                const semiAnnualTransactions = filterTransactionsByDateRange(transactions, 'semi-annual');
                const semiAnnualIncome = calculateTotalByType(semiAnnualTransactions, 'income');
                const semiAnnualExpenses = calculateTotalByType(semiAnnualTransactions, 'expense');
                setSemiAnnualData({ income: semiAnnualIncome, expenses: semiAnnualExpenses });

                // Calculate yearly totals
                const yearlyTransactions = filterTransactionsByDateRange(transactions, 'year');
                const yearlyIncome = calculateTotalByType(yearlyTransactions, 'income');
                const yearlyExpenses = calculateTotalByType(yearlyTransactions, 'expense');
                setYearlyData({ income: yearlyIncome, expenses: yearlyExpenses });
            })
            .catch(error => console.error(error));
    }, []);

    const filterTransactionsByDateRange = (transactions, range) => {
        const today = new Date();
        let startDate;

        switch (range) {
            case 'week':
                startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
                break;
            case 'semi-annual':
                startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(0); // Default to epoch start if no valid range specified
        }

        return transactions.filter(transaction => new Date(transaction.date) >= startDate);
    };

    const calculateTotalByType = (transactions, type) => {
        return transactions.reduce((total, transaction) => {
            if (transaction.type === type) {
                return total + parseFloat(transaction.amount);
            }
            return total;
        }, 0);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Dashboard</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Weekly Totals</h2>
                            <p className="card-text">Income: Nrs. {weeklyData.income.toFixed(2)}</p>
                            <p className="card-text">Expenses: Nrs. {weeklyData.expenses.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Monthly Totals</h2>
                            <p className="card-text">Income: Nrs. {monthlyData.income.toFixed(2)}</p>
                            <p className="card-text">Expenses: Nrs. {monthlyData.expenses.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Quarterly Totals</h2>
                            <p className="card-text">Income: Nrs. {quarterlyData.income.toFixed(2)}</p>
                            <p className="card-text">Expenses: Nrs. {quarterlyData.expenses.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Semi-Annual Totals</h2>
                            <p className="card-text">Income: Nrs. {semiAnnualData.income.toFixed(2)}</p>
                            <p className="card-text">Expenses: Nrs. {semiAnnualData.expenses.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Yearly Totals</h2>
                            <p className="card-text">Income: Nrs. {yearlyData.income.toFixed(2)}</p>
                            <p className="card-text">Expenses: Nrs. {yearlyData.expenses.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
