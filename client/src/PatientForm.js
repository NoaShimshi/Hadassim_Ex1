import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Patients.module.css';

function PatientForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identityCard: "",
    addressCity: "",
    addressStreet: "",
    addressNumber: "",
    dateOfBirth: null,
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
    let bDate = new Date(date);
    const formattedDate = bDate.toISOString().split('T')[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      dateOfBirth: formattedDate
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if all required fields are filled
    for (const field of formFields) {
        if (!formData[field.name]) {
            console.error(`${field.label} is required`);
        return; // Prevent form submission if any required field is missing
    }
  }
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
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name} className="form-row">
            <label>
              {field.label}: 
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
                  className="form-input"
                />
              )}
            </label>
          </div>
        ))}
        <button className="btn" type="submit">Submit</button>
        <button className="btn" type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
}

export default PatientForm;
