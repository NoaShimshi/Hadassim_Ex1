const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2424",
    database: "HADASSIM_EX1",
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var patients_table = "CREATE TABLE patients (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), identity_card VARCHAR(20), address_city VARCHAR(255), address_street VARCHAR(255), address_number VARCHAR(10), date_of_birth DATE, telephone VARCHAR(15), mobile_phone VARCHAR(15))";
  
    // var volumes_table_sql = "CREATE TABLE volumes (volume_id INT AUTO_INCREMENT PRIMARY KEY, tool_code INT, owner_code INT, deleted BINARY, availability BINARY)";
    // var tools_borrowed_table_sql = "CREATE TABLE tools_borrowed (id INT AUTO_INCREMENT PRIMARY KEY, user_code INT, request_id INT, request_date DATE, confirmation_date DATE, return_date DATE, volume_code INT , deleted BINARY)";
    // var tools_category_sql = "CREATE TABLE tools_category (id INT AUTO_INCREMENT PRIMARY KEY, tool_id INT, category_id INT)";
    // var categories_table_sql = "CREATE TABLE categories (id INT AUTO_INCREMENT PRIMARY KEY, category_name VARCHAR(255))";

    con.query(patients_table, function (err, result) {
      if (err) throw err;
      console.log("Table patients altered");
    });

  });