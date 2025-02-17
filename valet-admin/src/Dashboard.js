import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Import QR Code library with correct export

const Dashboard = () => {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carColor, setCarColor] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch('https://hilr06ht91.execute-api.us-east-2.amazonaws.com/dev/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVehicles(data); // ✅ Only set vehicles if it is an array
        } else {
          console.error("Unexpected response format:", data);
          setVehicles([]); // ✅ Prevents crash if data is invalid
        }
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
        setVehicles([]); // ✅ Prevents crash if fetch fails
      });
  }, []);
  
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    navigate('/'); // Redirect to login page
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    const vehicleData = {
      guestName,
      roomNumber,
      carMake,
      carModel,
      carColor,
      phoneNumber // Include phone number in the request
    };

    try {
      const response = await fetch('https://hilr06ht91.execute-api.us-east-2.amazonaws.com/dev/addVehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });

      const data = await response.json();
      console.log('Vehicle checked in:', data);
      alert('Vehicle checked in successfully! Guest will receive an SMS.');
      setVehicles([...vehicles, data]); // Update vehicle list
    } catch (error) {
      console.error('Error checking in vehicle:', error);
      alert('Error checking in vehicle');
    }
  };

  const handleRequestCar = async (vehicleId) => {
    try {
      const response = await fetch(`https://hilr06ht91.execute-api.us-east-2.amazonaws.com/dev/requestCar/${vehicleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        throw new Error('Failed to request car');
      }
  
      const updatedVehicle = await response.json();
      setVehicles(vehicles.map(vehicle => 
        vehicle._id === vehicleId ? { ...vehicle, requested: true } : vehicle
      ));
      alert('Car request sent successfully!');
    } catch (error) {
      console.error('Error requesting vehicle:', error);
      alert('Error requesting vehicle');
    }
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Welcome to the Valet Dashboard</h1>
      <p>This is where valet employees will manage vehicles.</p>
      
      <form onSubmit={handleCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input type="text" placeholder="Guest Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
        <input type="text" placeholder="Room Number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
        <input type="text" placeholder="Car Make" value={carMake} onChange={(e) => setCarMake(e.target.value)} required />
        <input type="text" placeholder="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)} required />
        <input type="text" placeholder="Car Color" value={carColor} onChange={(e) => setCarColor(e.target.value)} required />
        <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        <button type="submit">Check-In Vehicle</button>
      </form>
      
      <h2>Parked Vehicles</h2>
      <ul>
        {vehicles.map((vehicle, index) => (
          <li key={index}>
            {vehicle.guestName} - {vehicle.carMake} {vehicle.carModel} ({vehicle.carColor})
            <QRCodeCanvas value={vehicle.requestLink || 'No Link'} size={50} style={{ marginLeft: '10px' }} />
            {!vehicle.requested ? (
              <button onClick={() => handleRequestCar(vehicle._id)}>Request Car</button>
            ) : (
              <span style={{ color: 'red', marginLeft: '10px' }}>Requested</span>
            )}
          </li>
        ))}
      </ul>
      
      <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px' }}>Logout</button>
    </div>
  );
};

export default Dashboard;
