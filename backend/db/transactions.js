// transactions.js
const connection = require('./connection');

const getTransactions = (callback) => {
    const query = 'SELECT * FROM transactions';
    connection.query(query, callback);
};

const addTransaction = (transaction, callback) => {
    const query = 'INSERT INTO transactions (description, amount, date, type) VALUES (?, ?, ?, ?)';
    const values = [transaction.description, transaction.amount, transaction.date, transaction.type];
    connection.query(query, values, callback);
};

const updateTransaction = (id, transaction, callback) => {
    const query = 'UPDATE transactions SET description = ?, amount = ?, date = ?, type = ? WHERE id = ?';
    const values = [transaction.description, transaction.amount, transaction.date, transaction.type, id];
    connection.query(query, values, callback);
};

const deleteTransaction = (id, callback) => {
    const query = 'DELETE FROM transactions WHERE id = ?';
    connection.query(query, [id], callback);
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction };
