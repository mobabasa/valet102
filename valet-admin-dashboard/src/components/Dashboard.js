import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Sidebar Component
import Navbar from './Navbar'; // Navbar Component

const Dashboard = () => {
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
    
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />  {/* Add Sidebar Back */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />  {/* Add Navbar Back */}
        <div style={{ padding: '80px 20px 20px' }}> {/* Fixes text being covered */}
          <h1>Welcome to the Admin Dashboard</h1>
          <h2>Total Vehicles: {vehicles.length}</h2>
          <h3>Recent Check-Ins</h3>
          <ul>
            {vehicles.slice(0, 5).map((vehicle) => (
              <li key={vehicle.id}>
                {vehicle.guestName} - {vehicle.carMake} {vehicle.carModel} ({vehicle.carColor})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
