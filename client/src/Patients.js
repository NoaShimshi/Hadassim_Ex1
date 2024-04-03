import { useState, useEffect } from "react";
import Modal from "./Modal";
import PatientForm from "./PatientForm";
import PatientDetails from "./PatientDetails"; 
import styles from "./Patients.css";

function Patients({ onSelect }) {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);

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

  const fetchPatientDetails = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${patientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch patient details");
      }
      const data = await response.json();
      setPatientDetails(data);
    } catch (error) {
      console.error("Fetch patient details error:", error);
    }
  };

  const handleUpdatePatient = async (updatedData) => {
    try {
      const url = `http://localhost:3000/patients/${selectedPatient.id}`;
      const req = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      };
      const response = await fetch(url, req);
      if (!response.ok) {
        throw new Error("Failed to update patient");
      }
      fetchPatients();
    } catch (error) {
      console.error("Update patient error:", error);
    }
  };

  const handleDeletePatient = async () => {
    try {
      const url = `http://localhost:3000/patients/${selectedPatient.id}`;
      const req = {
        method: "DELETE",
      };
      const response = await fetch(url, req);
      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }
      fetchPatients();
      setSelectedPatient(null);
      setPatientDetails(null);
    } catch (error) {
      console.error("Delete patient error:", error);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    fetchPatientDetails(patient.id);
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
                <td>{patient.identity_card}</td>
                <td>{patient.first_name}</td>
                <td>{patient.last_name}</td>
              </tr>
            ))}
            </tbody>
          </table>
          {selectedPatient && (
            <div>
              <PatientDetails patient={patientDetails} />
              <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={() => setShowModal(true)}>Update Patient</button>
              <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={handleDeletePatient}>Delete Patient</button>
            </div>
          )}
          {showModal && (
            <Modal>
              <PatientForm
                patient={selectedPatient}
                onSubmit={handleUpdatePatient}
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
