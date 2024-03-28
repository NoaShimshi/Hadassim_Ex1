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
      
      localStorage.setItem("patients", JSON.stringify(data));
      setPatients(data);
    } catch (error) {
      console.error("Fetch patients error:", error);
    }
  };

  // Function to handle adding a new patient
  const handleAddPatient = async (patientData) => {
    console.log(patientData);
    const url = "http://localhost:3000/patients/newPatient";
    const req = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
    };

    await fetch(url, req)
        .then((res) => {
            console.log(res);
            fetchPatients();
            setShowModal(false);
        })
        .catch((error) => {
            console.log(error);
        });
  };

  // Effect to fetch patients data when the component mounts
  useEffect(() => {
    // Check if patient data is available in local storage
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      fetchPatients();
    }
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
