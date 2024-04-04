import React from 'react';
import { useState, useEffect } from "react";
import styles from "./Patients.module.css";

function PatientDetails({ patient }) {
    const [patientDetails, setPatientDetails] = useState(null);
    const [isEdit, setIsEdit] = useState(0);

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

    useEffect(() => {
      const currentPatientId = localStorage.getItem("currentPatient");
      if (currentPatientId) {
        fetchPatientDetails(currentPatientId);
      }
    }, []);

    
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

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <h5>Patient Details</h5>
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
                <td>{patientDetails.date_of_birth}</td>
                <td>{patientDetails.telephone}</td>
                <td>{patientDetails.mobile_phone}</td>
              </tr> 
            </tbody>
          </table>
          <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={() => setIsEdit(1)}>Edit patient info</button>
          <button style={{ display: 'block', margin: 'auto', marginTop: '10px' }} onClick={() => handleDeletePatient()}>Delete patient</button>
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
    </div>
  );
  
}

export default PatientDetails;