import React, { useState } from "react";

function PatientForm({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identityCard, setIdentityCard] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const patient = {
      firstName,
      lastName,
      identityCard,
      addressCity,
      addressStreet,
      addressNumber,
      dateOfBirth,
      telephone,
      mobilePhone,
    };
    onSubmit(patient);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default PatientForm;
