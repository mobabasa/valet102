import React, { useEffect, useState } from 'react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    guestName: '',
    carMake: '',
    carModel: '',
    carColor: '',
    licensePlate: '',
    phoneNumber: '',
    roomNumber: ''
  });

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      const response = await fetch("https://hilr06ht91.execute-api.us-east-2.amazonaws.com/dev/vehicles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch vehicles");

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/addVehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add vehicle");

      alert("Vehicle added successfully!");
      setFormData({ guestName: '', carMake: '', carModel: '', carColor: '', licensePlate: '', phoneNumber: '', roomNumber: '' });
      fetchVehicles();  // Refresh vehicle list
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle.");
    }
  };
  // Handle Vehicle Checkout
  const handleCheckOut = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}checkOutVehicle/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to check out vehicle");
  
      alert("Vehicle checked out successfully!");
      fetchVehicles();  // Refresh vehicle list after checkout
    } catch (error) {
      console.error("Error checking out vehicle:", error);
      alert("Failed to check out vehicle.");
    }
  };
  
  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div>
      <h1>Vehicle Management</h1>

      {/* Add Vehicle Form */}
      <form onSubmit={handleSubmit}>
        <h2>Add New Vehicle</h2>
        <input type="text" name="guestName" placeholder="Guest Name" value={formData.guestName} onChange={handleInputChange} required />
        <input type="text" name="carMake" placeholder="Car Make" value={formData.carMake} onChange={handleInputChange} required />
        <input type="text" name="carModel" placeholder="Car Model" value={formData.carModel} onChange={handleInputChange} required />
        <input type="text" name="carColor" placeholder="Car Color" value={formData.carColor} onChange={handleInputChange} required />
        <input type="text" name="licensePlate" placeholder="License Plate" value={formData.licensePlate} onChange={handleInputChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
        <input type="text" name="roomNumber" placeholder="Room Number" value={formData.roomNumber} onChange={handleInputChange} required />
        <button type="submit">Add Vehicle</button>
      </form>

      {/* Vehicle List */}
      <h2>Current Vehicles</h2>
      <table>
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Make</th>
            <th>Model</th>
            <th>Color</th>
            <th>License Plate</th>
            <th>Phone</th>
            <th>Room #</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
            <td>{vehicle.guestName}</td>
            <td>{vehicle.carMake}</td>
            <td>{vehicle.carModel}</td>
            <td>{vehicle.carColor}</td>
            <td>{vehicle.licensePlate}</td>
            <td>{vehicle.phoneNumber}</td>
            <td>{vehicle.roomNumber}</td>
            <td>
              {vehicle.status !== 'Checked Out' ? (
                <button onClick={() => handleCheckOut(vehicle.id)}>Check Out</button>
              ) : (
                'Checked Out'
              )}
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vehicles;
