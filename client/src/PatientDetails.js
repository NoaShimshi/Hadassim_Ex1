import React from 'react';

function PatientDetails({ patient }) {
  if (!patient) {
    return <div>No patient selected</div>;
  }

  return (
    <div>
      <h2>Patient Details</h2>
      <p>ID: {patient.id}</p>
      <p>First Name: {patient.first_name}</p>
      <p>Last Name: {patient.last_name}</p>
      <p>Identity Card: {patient.identity_card}</p>
      <p>Address: {patient.address_city}, {patient.address_street} {patient.address_number}</p>
      <p>Date of Birth: {patient.date_of_birth}</p>
      <p>Telephone: {patient.telephone}</p>
      <p>Mobile Phone: {patient.mobile_phone}</p>
    </div>
  );
}

export default PatientDetails;
