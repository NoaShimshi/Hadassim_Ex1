import React from 'react';
import { useState, useEffect } from "react";
import styles from "./Patients.module.css";

function PatientDetails({ patient }) {
    const [patientDetails, setPatientDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("INFO"); 
    const [isEdit, setIsEdit] = useState(0);
    const [covidInfo, setCovidInfo] = useState({});
    const [vaccineDoses, setVaccineDoses] = useState([]);
    const [receivedDoses, setReceivedDoses] = useState([]);
    const [vaccinationDate, setVaccinationDate] = useState('');
    const [vaccineManufacturerId, setVaccineManufacturerId] = useState('');
    const [vaccineManufacturers, setVaccineManufacturers] = useState([]);
    const [isVaccinated, setIsVaccinated] = useState(false);

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

    const fetchCovidInfo = async (patientId) => {
      // Fetch COVID-19 information for the patient from the server
      // Update the state with the fetched data
    };
  
    const fetchVaccineDoses = async () => {
      try {
        const response = await fetch("http://localhost:3000/covid19/vaccineDoses");
        if (!response.ok) {
          throw new Error("Failed to fetch vaccine doses");
        }
        const data = await response.json();
        setVaccineDoses(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Fetch vaccine doses error:", error);
      }
    };

    const fetchVaccineManufacturers = async () => {
      try {
        const response = await fetch('http://localhost:3000/covid19/vaccinations');
        if (!response.ok) {
          throw new Error('Failed to fetch vaccine manufacturers');
        }
        const data = await response.json();
        setVaccineManufacturers(data);
      } catch (error) {
        console.error('Fetch vaccine manufacturers error:', error);
      }
    };
  
    const fetchReceivedDoses = async (patientId) => {
        try {
          const response = await fetch(`http://localhost:3000/covid19/patient/${patientId}/vaccineDoses`);
          if (!response.ok) {
              throw new Error("Failed to fetch vaccine doses");
          }
          const data = await response.json();
          
          // Extract vaccine manufacturer IDs from the received data
          const manufacturerIds = data
                                      .filter(dose => dose.vaccinated) // Filter only vaccinated doses
                                      .map(dose => dose.vaccine_manufacturer_id)
                                      .filter(id => id !== null && id !== undefined);
          // Fetch vaccine manufacturer names for the extracted IDs
          const manufacturersResponse = await Promise.all(
              manufacturerIds.map(id =>
                  fetch(`http://localhost:3000/covid19/vaccineManufacturers/${id}`)
              )
          );
          
          if (!manufacturersResponse.every(response => response.ok)) {
              throw new Error("Failed to fetch vaccine manufacturers");
          }
  
          const manufacturersData = await Promise.all(
              manufacturersResponse.map(response => response.json())
          );
          
          // Combine the received doses data with the manufacturer names
          const dosesWithManufacturers = data.map((dose, index) => ({
            ...dose,
            vaccine_manufacturer: manufacturersData[index]?.vaccine_manufacturer
        }));
  
          setReceivedDoses(dosesWithManufacturers);
      } catch (error) {
          console.error("Fetch vaccine doses error:", error);
      }
    };

    useEffect(() => {
      const currentPatientId = localStorage.getItem("currentPatient");
      if (currentPatientId) {
        fetchPatientDetails(currentPatientId);
        fetchCovidInfo(currentPatientId);
        fetchVaccineDoses();
        fetchReceivedDoses(currentPatientId);
        fetchVaccineManufacturers();
      }
    }, []);

    const handleVaccinate = async (doseId) => {
      let dateOfVaccination = new Date(vaccinationDate);
      let formattedDateOfVaccination = dateOfVaccination.toISOString().split('T')[0];
      try {
        const response = await fetch(`http://localhost:3000/covid19/patient/${patientDetails.id}/vaccineDoses/${doseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              vaccinationDate: formattedDateOfVaccination,
              vaccineManufacturerId,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to mark patient as vaccinated');
        }

        fetchReceivedDoses(patientDetails.id);
        // const updatedReceivedDoses = [...receivedDoses, doseId];
        // setReceivedDoses(updatedReceivedDoses);

        // Set isVaccinated to true
        setIsVaccinated(true);
      } catch (error) {
          console.error('Vaccinate patient error:', error);
      }
    };

  const handleUpdatePatient = async () => {

      let first_name_ = document.getElementById("first_name").value;
      let last_name_ = document.getElementById("last_name").value;
      let identity_card_ = document.getElementById("identity_card").value;
      let address_city_ = document.getElementById("address_city").value;
      let address_street_ = document.getElementById("address_street").value;
      let address_number_ = document.getElementById("address_number").value;
      let date_of_birth_ = document.getElementById("date_of_birth").value;
      let dateOfBirth = new Date(date_of_birth_);
      let formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0];
      let telephone_ = document.getElementById("telephone").value;
      let mobile_phone_ = document.getElementById("mobile_phone").value;
      const updatedData = {
        id: patientDetails.id,
        first_name: first_name_,
        last_name: last_name_,
        identity_card: identity_card_,
        address_city: address_city_,
        address_street: address_street_,
        address_number: address_number_,
        date_of_birth: formattedDateOfBirth,
        telephone: telephone_,
        mobile_phone:mobile_phone_
      }
      const url = `http://localhost:3000/patients/${patientDetails.id}`;
      const req = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      };
      await fetch(url, req)
        .then((res) => {
          setPatientDetails(updatedData);
          setIsEdit(0);
        })
        .catch((error) => {
          console.error("Update patient error:", error);
        }
        )
  };

  const handleDeletePatient = async () => {
    try {
      const url = `http://localhost:3000/patients/${patientDetails.id}`;
      const req = {
        method: "DELETE",
      };
      const response = await fetch(url, req);
      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }
    } catch (error) {
      console.error("Delete patient error:", error);
    }
  };

  if (!patientDetails) {
    return <div>No patient selected</div>;
  }

  const renderInfoTab = () => (
    <div className={styles.tabContent}>
      {isEdit === 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <td>
                  <h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>
                    Name
                  </h3>
                </td>
                <td>
                  <h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>
                    Identity Card
                  </h3>
                </td>
                <td>
                  <h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>
                    Address
                  </h3>
                </td>
                <td>
                  <h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>
                    Date of Birth
                  </h3>
                </td>
                <td>
                  <h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>
                    Telephone
                  </h3>
                </td>
                <td>
                  <h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>
                    Mobile Phone
                  </h3>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{patientDetails.first_name} {patientDetails.last_name}</td>
                <td>{patientDetails.identity_card}</td>
                <td>{patientDetails.address_city}, {patientDetails.address_street} {patientDetails.address_number}</td>
                <td>{patientDetails.date_of_birth && new Date(patientDetails.date_of_birth).toLocaleDateString('en-GB')}</td>
                <td>{patientDetails.telephone}</td>
                <td>{patientDetails.mobile_phone}</td>
              </tr> 
            </tbody>
          </table>
          <div className={styles.buttonContainer}>
            <button className={styles.btn} onClick={() => setIsEdit(1)}>Edit patient info</button>
              <button className={styles.btn} onClick={() => handleDeletePatient()}>Delete patient</button>
          </div>       
         </>
      ) : (
        <>
          {patientDetails && (
            <>
              <p>ID: {patientDetails.id}</p>
              <p>First Name: </p><input id="first_name" defaultValue={patientDetails.first_name}/>
              <p>Last Name: </p><input id="last_name" defaultValue={patientDetails.last_name}/>
              <p>Identity Card: </p><input id="identity_card" defaultValue={patientDetails.identity_card}/>
              <p>Address - city: </p><input id="address_city" defaultValue={patientDetails.address_city}/>
              <p>Address - street: </p><input id="address_street" defaultValue={patientDetails.address_street}/>
              <p>Address - number: </p><input id="address_number" defaultValue={patientDetails.address_number}/>
              <p>Date of Birth: </p><input id="date_of_birth" defaultValue={patientDetails.date_of_birth}/>
              <p>Telephone: </p><input id="telephone" defaultValue={patientDetails.telephone}/>
              <p>Mobile Phone: </p><input id="mobile_phone" defaultValue={patientDetails.mobile_phone}/>
              <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={() => handleUpdatePatient()}>Update</button>
            </>
          )}
        </>
      )}
    </div>
  );
  

const renderCovidTab = () => (
  <>
    <div className={styles.tabContent}> 
      <h5>Vaccine Doses</h5>
      <table>
        <thead>
          <tr>
            <td><h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>Dose Name</h3></td>
            <td><h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>Status</h3></td>
            <td><h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>Vaccination Date</h3></td>
            <td><h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>Vaccine Manufacturer</h3></td>
            <td><h3 style={{ fontWeight: 'bold', color: 'rgb(105,105,105)' }}>Action</h3></td>
          </tr>
        </thead>
        <tbody>
          {receivedDoses.map((dose) => (
            <tr key={dose.id}>
              <td>{dose.dose_name}</td>
              <td>{dose.vaccinated ? "Vaccinated" : "Not Vaccinated"}</td>
              <td>
                {dose.vaccinated ? dose.vaccination_date && new Date(dose.vaccination_date).toLocaleDateString('en-GB') : (
                  <input
                    type="date"
                    value={vaccinationDate}
                    onChange={(e) => setVaccinationDate(e.target.value)}
                  />
                )}
              </td>
              <td>
                {dose.vaccinated ? dose.vaccine_manufacturer : (
                  <select value={vaccineManufacturerId} onChange={(e) => setVaccineManufacturerId(e.target.value)}>
                    <option value="">Select Manufacturer</option>
                    {vaccineManufacturers.map(manufacturer => (
                      <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.vaccine_manufacturer}</option>
                    ))}
                  </select>
                )}
              </td>               
              <td>
                {!dose.vaccinated && (
                  <button onClick={() => handleVaccinate(dose.id)}>Vaccinate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <h5>Patient Details</h5>
        <div className={styles.tabContainer}>
          <div className={`${styles.tab} ${activeTab === "INFO" ? styles.active : ""}`} onClick={() => setActiveTab("INFO")}>INFO</div>
          <div className={`${styles.tab} ${activeTab === "COVID-19" ? styles.active : ""}`} onClick={() => setActiveTab("COVID-19")}>COVID-19</div>
        </div>
        {activeTab === "INFO" ? renderInfoTab() : renderCovidTab()}
      </div>
    </div>
  );
  
}

export default PatientDetails;