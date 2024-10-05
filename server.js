
const express = require('express');
const app = express(); 
const mysql = require('mysql2');
const cors = require('cors');

const dotenv = require('dotenv'); 


app.use(express.json());
app.use(cors());
dotenv.config(); 


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

// Check if there is a connection 
db.connect((err) => {
    // If no connection 
    if(err) return console.log("Error connecting to MYSQL");

    //If connect works successfully
    console.log("Connected to MYSQL as id: ", db.threadId); 
}) 

// 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Question 1
app.get('/data', (req,res) => {
    db.query('SELECT * FROM patients', (err, results) =>{
        if (err){
            console.error(err);
            res.status(500).send('Error Retrieving data')
        }else {
            res.render('data', {results: results});
        }
    });
});
  
  // Question 2: Retrieve all providers
  app.get('/provider', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(sql, (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving providers');
      } else {
        res.render('provider', { results: results });
      }
    });
  });
  
//  Q 3
  app.get('/data/:first_name', (req, res) => {
    const { first_name } = req.params;
    const Sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(Sql, [first_name], (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving patients');
      } else {
        res.render('data', { results: results });
    }
    });
  });
  
  // Question 4: Retrieve all providers by their specialty
  app.get('/provider/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(sql, [specialty], (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving providers by specialty');
      } else {
        res.render('provider', { results: results });
      }
    });
  });
  


// Start the server 
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser 
    console.log('Sending message to browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });

});

