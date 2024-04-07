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
    var vaccinations_table = "CREATE TABLE vaccinations (id INT AUTO_INCREMENT PRIMARY KEY, vaccine_manufacturer VARCHAR(255))";
    var corona_patients_table = "CREATE TABLE corona_patients (id INT AUTO_INCREMENT PRIMARY KEY, patient_id INT, illness_date DATE, recovery_date DATE, FOREIGN KEY (patient_id) REFERENCES patients(id))"
    var vaccine_doses_table = "CREATE TABLE vaccine_doses (id INT AUTO_INCREMENT PRIMARY KEY, dose_name VARCHAR(255))";
    var dose_patient_vaccine_table = "CREATE TABLE dose_patient_vaccine (id INT AUTO_INCREMENT PRIMARY KEY, patient_id INT, vaccine_dose_id INT, FOREIGN KEY (patient_id) REFERENCES patients(id), FOREIGN KEY (vaccine_dose_id) REFERENCES vaccine_doses(id))"
    // ALTER TABLE dose_patient_vaccine
    // ADD COLUMN vaccination_date DATE,
    // ADD COLUMN vaccine_manufacturer_id INT,
    // ADD FOREIGN KEY (vaccine_manufacturer_id) REFERENCES vaccinations(id);

    con.query(patients_table, function (err, result) {
      if (err) throw err;
      console.log("patients_table altered");
    });

    con.query(vaccinations_table, function (err, result) {
      if (err) throw err;
      console.log("vaccinations_table altered");
    });

    con.query(corona_patients_table, function (err, result) {
      if (err) throw err;
      console.log("corona_patients_table altered");
    });

    con.query(vaccine_doses_table, function (err, result) {
      if (err) throw err;
      console.log("vaccine_doses_table altered");
    });

    con.query(dose_patient_vaccine_table, function (err, result) {
      if (err) throw err;
      console.log("dose_patient_vaccine_table altered");
    });
  });