import { useState, useEffect } from "react";
import Modal from "./Modal";
import PatientForm from "./PatientForm";

function Patients({ onSelect }) {
  // State to store the list of patients
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Function to fetch patients from the backend API
  const fetchPatients = async () => {
    try {
      console.log("Fetching patients...");
      const response = await fetch("http://localhost:3000/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      console.log("Fetched patients data:", data);
      setPatients(data);
    } catch (error) {
      console.error("Fetch patients error:", error);
    }
  };

  // Function to handle adding a new patient
  const handleAddPatient = async (patientData) => {
    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      if (!response.ok) {
        throw new Error("Failed to add patient");
      }
      // Refresh patients list
      fetchPatients();
      // Close the modal or form
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Effect to fetch patients data when the component mounts
  useEffect(() => {
    fetchPatients();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <h2>Patients List</h2>
      <button onClick={() => setShowModal(true)}>Add Patient</button>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id} onClick={() => onSelect(patient)}>
            {patient.identity_card} - {patient.first_name} - {patient.last_name}
          </li>
        ))}
      </ul>
      {showModal && (
        <Modal>
          <PatientForm onSubmit={handleAddPatient} onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}

export default Patients;
