const express = require('express');
const { dbName, sqlConnect } = require('./connectToDB');
const router = express.Router();

router.get("/", function (req, res) {
    console.log('Fetching patients');

    const query = `SELECT id, first_name, last_name, identity_card FROM ${dbName}.patients`;
    
    console.log(query);
    sqlConnect(query)
      .then((results) => {
        console.log(results);
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

router.post("/newPatient", function (req, res) {
    console.log('Adding new patient');
    console.log('Request Body:', req.body);

    const { firstName, lastName, identityCard, addressCity, addressStreet, addressNumber, dateOfBirth, telephone, mobilePhone } = req.body;
    
    const query = `INSERT INTO ${dbName}.patients SET first_name = ?, last_name = ?, identity_card = ?, address_city = ?, address_street = ?, address_number = ?, date_of_birth = ?, telephone = ?, mobile_phone = ?`;

    const values = [firstName, lastName, identityCard, addressCity, addressStreet, addressNumber, dateOfBirth, telephone, mobilePhone];
    
    sqlConnect(query, values)
      .then(() => {
        res.status(201).send("Patient added successfully");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
      });
});

router.put("/:id", function (req, res) {
  const patientId = req.params.id;
  const { first_name, last_name, identity_card, address_city, address_street, address_number, date_of_birth, telephone, mobile_phone } = req.body;
  
  const query = `UPDATE ${dbName}.patients 
                 SET first_name = ?, last_name = ?, identity_card = ?, address_city = ?, address_street = ?, address_number = ?, date_of_birth = ?, telephone = ?, mobile_phone = ?
                 WHERE id = ?`;
  
  const values = [first_name, last_name, identity_card, address_city, address_street, address_number, date_of_birth, telephone, mobile_phone, patientId];
  
  sqlConnect(query, values)
    .then(() => {
      res.status(200).send("Patient updated successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

router.delete("/:id", function (req, res) {
  const patientId = req.params.id;
  
  const query = `DELETE FROM ${dbName}.patients WHERE id = ?`;
  
  sqlConnect(query, [patientId])
    .then(() => {
      res.status(200).send("Patient deleted successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

module.exports = router;
