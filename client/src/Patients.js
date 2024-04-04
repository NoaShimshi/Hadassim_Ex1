import { useState, useEffect } from "react";
import { Link} from 'react-router-dom';
import Modal from "./Modal";
import PatientForm from "./PatientForm";
import styles from "./Patients.module.css";

function Patients({ onSelect }) {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:3000/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      localStorage.setItem("patients", JSON.stringify(data));
      setPatients(data);
    } catch (error) {
      console.error("Fetch patients error:", error);
    }
  };

  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      fetchPatients();
    }
  }, []);

  const handlePatientSelect = (patient) => {
    localStorage.setItem("currentPatient", patient.id);
  };

  const handleAddPatient = async (newPatientData) => {
    try {
      const response = await fetch("http://localhost:3000/patients/newPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatientData),
      });
      if (!response.ok) {
        throw new Error("Failed to add new patient");
      }
      fetchPatients();
      setShowModal(false);
    } catch (error) {
      console.error("Add patient error:", error);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <h5>Patients List</h5>
          <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={() => setShowModal(true) }>Add Patient</button>
          <table>
            <thead>
              <tr>
                <td>
                <h3 style={{ fontWeight: 'bold',color:'rgb(105,105,105)' }}>
                Identity card
                </h3>
                  </td>
                <td>
                <h3 style={{ fontWeight: 'bold',color:'rgb(105,105,105)' }}>
                First name
                </h3>
                 </td>
                <td>
                <h3 style={{ fontWeight: 'bold',color:'rgb(105,105,105)' }}>
                Last name
                </h3>
                </td>
            </tr>
            </thead>
            <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} onClick={() => handlePatientSelect(patient)}>
                <td>
                  <Link to={`/patients/${patient.id}`} onClick={() => handlePatientSelect(patient)}>{patient.identity_card}</Link>
                </td>
                <td>{patient.first_name}</td>
                <td>{patient.last_name}</td>
              </tr>
            ))}
            </tbody>
          </table>
          {/* {selectedPatient && (
            <div>
              <PatientDetails patient={patientDetails} />
              <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={() => setShowModal(true)}>Update Patient</button>
              <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={handleDeletePatient}>Delete Patient</button>
            </div>
          )} */}
          {showModal && (
            <Modal>
              <PatientForm
                // patient={selectedPatient}
                // onSubmit={handleUpdatePatient}
                onSubmit={handleAddPatient}
                onClose={() => setShowModal(false)}
              />
            </Modal>
          )}
        </div>
      </div>
    </section>
  );
}

export default Patients;
