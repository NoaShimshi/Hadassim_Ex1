import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Patients from "./Patients";
import PatientDetails from "./PatientDetails";

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Function to handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/patients" />} />
          <Route path="/patients" element={<Patients onSelect={handlePatientSelect} />} />
          <Route path="/patients/:id" element={<PatientDetails patient={selectedPatient} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
