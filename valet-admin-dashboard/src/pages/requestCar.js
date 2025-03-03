import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const RequestCarPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Fetch current status of the vehicle (optional)
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/vehicles/${id}`);
        const data = await response.json();
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleRequestCar = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/requestCar/${id}`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Failed to request car");

      setStatus("Requested");
      alert("Your car has been requested!");
    } catch (error) {
      console.error("Error requesting car:", error);
      alert("Failed to request car.");
    }
  };

  return (
    <div>
      <h1>Request Your Car</h1>
      <p>Status: {status}</p>
      {status !== "Requested" ? (
        <button onClick={handleRequestCar}>Request Car</button>
      ) : (
        <p>Your car has already been requested.</p>
      )}
    </div>
  );
};

export default RequestCarPage;
