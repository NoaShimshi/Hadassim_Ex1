import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function PatientForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identityCard: "",
    addressCity: "",
    addressStreet: "",
    addressNumber: "",
    dateOfBirth: new Date(),
    telephone: "",
    mobilePhone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dateOfBirth: date
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  // Array of form fields with their corresponding names and labels
  const formFields = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "identityCard", label: "Identity Card" },
    { name: "addressCity", label: "Address City" },
    { name: "addressStreet", label: "Address Street" },
    { name: "addressNumber", label: "Address Number" },
    { name: "dateOfBirth", label: "Date of Birth" },
    { name: "telephone", label: "Telephone" },
    { name: "mobilePhone", label: "Mobile Phone" }
  ];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name}>
            <label>
              {field.label}: <br />
              {field.name === "dateOfBirth" ? (
                <DatePicker
                  selected={formData[field.name]}
                  onChange={handleDateChange}
                />
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              )}
            </label>
            <br />
          </div>
        ))}
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
}

export default PatientForm;
