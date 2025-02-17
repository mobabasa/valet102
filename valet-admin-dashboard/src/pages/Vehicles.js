import React, { useEffect, useState } from 'react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
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

    fetchVehicles();
  }, []);

  return (
    <div>
      <h1>Vehicle Management</h1>
      <table>
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Make</th>
            <th>Model</th>
            <th>Color</th>
            <th>License Plate</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vehicles;
