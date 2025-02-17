import React from 'react';
import Sidebar from './Sidebar'; // Ensure the path is correct
import Navbar from './Navbar'; // Ensure the path is correct

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <h1>Welcome to the Admin Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
