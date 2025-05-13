const express = require('express');
const mysql = require('mysql2');
const Web3 = require('web3');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'hansdimas',
    password: 'hansdimas',
    database: 'medical_records'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MariaDB');
    }
});

// Web3 connection
const web3 = new Web3('http://127.0.0.1:8572'); // Sesuaikan dengan Anvil atau Ganache
console.log('Web3 connected:', !!web3);

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint untuk menambah record
app.post('/api/records', async (req, res) => {
    const { patientName, doctorName, diagnosis } = req.body;

    // Simpan ke database
    const sql = `INSERT INTO records (patient_name, doctor_name, diagnosis) VALUES (?, ?, ?)`;
    db.query(sql, [patientName, doctorName, diagnosis], (err, result) => {
        if (err) {
            console.error('Error inserting record:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Record added to database:', result.insertId);
        res.json({ message: 'Record added successfully', id: result.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
