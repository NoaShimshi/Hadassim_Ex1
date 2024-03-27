const { dbName, sqlConnect } = require('./connectToDB');
const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    console.log('Fetching patients');

    const query = `SELECT id, first_name, last_name, identity_card FROM ${dbName}.patients`;
    
    sqlConnect(query)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
      });
  });
  
  router.get("/:id", function (req, res) {
    const patientId = req.params.id;
    
    const query = `SELECT * FROM ${dbName}.patients WHERE id = ?`;
    
    sqlConnect(query, [patientId])
      .then((results) => {
        if (results.length === 1) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).send("Patient not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
      });
  });
  
  router.post("/", function (req, res) {
    console.log('Addind new patient');

    const { first_name, last_name, identity_card, address_city, address_street, address_number, date_of_birth, telephone, mobile_phone } = req.body;
    
    const query = `INSERT INTO ${dbName}.patients (first_name, last_name, identity_card, address_city, address_street, address_number, date_of_birth, telephone, mobile_phone) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [first_name, last_name, identity_card, address_city, address_street, address_number, date_of_birth, telephone, mobile_phone];
    
    sqlConnect(query, values)
      .then(() => {
        res.status(201).send("Patient added successfully");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
      });
  });
  

module.exports = router;
