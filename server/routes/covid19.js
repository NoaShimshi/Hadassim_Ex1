const express = require('express');
const { dbName, sqlConnect } = require('./connectToDB');
const router = express.Router();

router.get("/vaccineDoses", function (req, res) {
    console.log('Fetching vaccine doses');

    const query = `SELECT id, dose_name FROM ${dbName}.vaccine_doses`; // SQL query to fetch vaccine doses

    sqlConnect(query)
      .then((results) => {
        // console.log(results);
        res.status(200).json(results); // Sending fetched vaccine doses as a JSON response
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
      });
});

router.get("/patient/:id/vaccineDoses", function (req, res) {
    const patientId = req.params.id;
    console.log(`Fetching vaccine doses for patient ${patientId}`);

    const query = `SELECT vd.id, vd.dose_name, IFNULL(dpv.id, 0) AS vaccinated, dpv.vaccination_date, dpv.vaccine_manufacturer_id
                   FROM ${dbName}.vaccine_doses vd
                   LEFT JOIN ${dbName}.dose_patient_vaccine dpv
                   ON vd.id = dpv.vaccine_dose_id AND dpv.patient_id = ${patientId}`;

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

router.get("/vaccinations", function (req, res) {
    console.log('Fetching vaccinations');
  
    const query = `SELECT id, vaccine_manufacturer FROM ${dbName}.vaccinations`; // SQL query to fetch vaccinations
  
    sqlConnect(query)
      .then((results) => {
        console.log(results);
        res.status(200).json(results); // Sending fetched vaccinations as a JSON response
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("An error occurred");
      });
  });
  
  router.post("/patient/:id/vaccineDoses/:doseId", function (req, res) {
    const patientId = req.params.id;
    const doseId = req.params.doseId;
    const { vaccinationDate, vaccineManufacturerId } = req.body;
  
    console.log(`Vaccinating patient ${patientId} with dose ${doseId}`);
  
    // Execute SQL query to update the database with vaccination information
    const query = `INSERT INTO ${dbName}.dose_patient_vaccine (patient_id, vaccine_dose_id, vaccination_date, vaccine_manufacturer_id) VALUES (${patientId}, ${doseId}, '${vaccinationDate}', ${vaccineManufacturerId})`;
  
    sqlConnect(query)
      .then(() => {
        console.log(`Patient ${patientId} vaccinated with dose ${doseId}`);
        res.status(200).send("Patient vaccinated successfully");
      })
      .catch((err) => {
        console.error("Vaccination error:", err);
        res.status(500).send("An error occurred during vaccination");
      });
  });
  
router.get("/vaccineManufacturers/:id", function (req, res) {
    const manufacturerId = req.params.id;
    console.log(`Fetching vaccine manufacturer for ID ${manufacturerId}`);

    const query = `SELECT vaccine_manufacturer FROM ${dbName}.vaccinations WHERE id = ${manufacturerId}`;

    sqlConnect(query)
      .then((results) => {
         if (results.length === 0) {
            res.status(404).send("Vaccine manufacturer not found");
         } else {
            res.status(200).json(results[0]);
         }
      })
      .catch((err) => {
         console.error(err);
         res.status(500).send("An error occurred");
      });
});

router.get('/corona/patient/:id', async (req, res) => {
    const patientId = req.params.id;
    const query = `SELECT * FROM ${dbName}.corona_patients WHERE patient_id = ${patientId}`;

    sqlConnect(query)
    .then((results) => {
       if (results.length === 0) {
          res.status(404).send("Patient corona information not found");
       } else {
          res.status(200).json(results[0]);
       }
    })
    .catch((err) => {
       console.error(err);
       res.status(500).send("An error occurred");
    });
});

// router.put('/corona/patient/:id', async (req, res) => {
//     const patientId = req.params.id;
//     const { illnessDate, recoveryDate } = req.body;
//     try {
//         let query;
//         if (illnessDate && recoveryDate) {
//             query = `UPDATE ${dbName}.corona_patients SET illness_date = '${illnessDate}', recovery_date = '${recoveryDate}' WHERE patient_id = ${patientId}`;
//         } else if (recoveryDate) {
//             query = `UPDATE ${dbName}.corona_patients SET recovery_date = '${recoveryDate}' WHERE patient_id = ${patientId}`;
//         }
//         if (query) {
//             await sqlConnect(query);
//             res.status(200).json({ message: 'Corona information updated successfully' });
//         } else {
//             res.status(400).json({ message: 'Invalid request parameters' });
//         }
//     } catch (error) {
//         console.error('Update corona information error:', error);
//         res.status(500).json({ message: 'An error occurred while updating corona information' });
//     }
// });

// Update illnessDate
router.put('/corona/patient/:id/illness', async (req, res) => {
  const patientId = req.params.id;
  const { illnessDate } = req.body;
  try {
      if (illnessDate) {
          // Check if a record exists for the patient
          let query = `SELECT * FROM ${dbName}.corona_patients WHERE patient_id = ${patientId}`;
          let result = await sqlConnect(query);
          
          if (result.length === 0) {
              // If no record exists, insert a new record
              query = `INSERT INTO ${dbName}.corona_patients (patient_id, illness_date) VALUES (${patientId}, '${illnessDate}')`;
              await sqlConnect(query);
          } else {
              // Update existing record
              query = `UPDATE ${dbName}.corona_patients SET illness_date = '${illnessDate}' WHERE patient_id = ${patientId}`;
              await sqlConnect(query);
          }

          res.status(200).json({ message: 'Illness date updated successfully' });
      } else {
          res.status(400).json({ message: 'Invalid request parameters' });
      }
  } catch (error) {
      console.error('Update illness date error:', error);
      res.status(500).json({ message: 'An error occurred while updating illness date' });
  }
});

// Update recoveryDate
router.put('/corona/patient/:id/recovery', async (req, res) => {
  const patientId = req.params.id;
  const { recoveryDate } = req.body;
  try {
      if (recoveryDate) {
          // Check if a record exists for the patient
          let query = `SELECT * FROM ${dbName}.corona_patients WHERE patient_id = ${patientId}`;
          let result = await sqlConnect(query);
          
          if (result.length === 0) {
              // If no record exists, insert a new record
              query = `INSERT INTO ${dbName}.corona_patients (patient_id, recovery_date) VALUES (${patientId}, '${recoveryDate}')`;
              await sqlConnect(query);
          } else {
              // Update existing record
              query = `UPDATE ${dbName}.corona_patients SET recovery_date = '${recoveryDate}' WHERE patient_id = ${patientId}`;
              await sqlConnect(query);
          }

          res.status(200).json({ message: 'Recovery date updated successfully' });
      } else {
          res.status(400).json({ message: 'Invalid request parameters' });
      }
  } catch (error) {
      console.error('Update recovery date error:', error);
      res.status(500).json({ message: 'An error occurred while updating recovery date' });
  }
});

module.exports = router;