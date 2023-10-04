const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'CalmCotton',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + db.threadId);
});

app.use(bodyParser.json());

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error signing up: ' + err.message);
      res.status(500).json({ error: 'An error occurred while signing up' });
      return;
    }
    res.json({ message: 'User signed up successfully' });
  });
});

app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error signing in: ' + err.message);
      res.status(500).json({ error: 'An error occurred while signing in' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      res.json({ message: 'User signed in successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
