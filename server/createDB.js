const mysql = require('mysql2');

// Create a connection to the MySQL server
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2424"
});

// Define the SQL query to create the database
const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS HADASSIM_EX1";

// Execute the query to create the database
con.query(createDatabaseQuery, function (err, result) {
    if (err) {
        console.error("Error creating database:", err.message);
    } else {
        console.log("Database created successfully");
    }

    // Close the connection
    con.end();
});
