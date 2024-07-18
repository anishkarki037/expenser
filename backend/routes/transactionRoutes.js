// transactionRoutes.js
const express = require('express');
const { getTransactions, addTransaction, updateTransaction, deleteTransaction } = require('../db/transactions');
const router = express.Router();

router.get('/', (req, res) => {
    getTransactions((err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const transaction = req.body;
    addTransaction(transaction, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Transaction added successfully' });
    });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const transaction = req.body;
    updateTransaction(id, transaction, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Transaction updated successfully' });
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    deleteTransaction(id, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Transaction deleted successfully' });
    });
});

module.exports = router;
