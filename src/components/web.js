// src/WebSocketChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const SOCKET_URL = 'ws://192.168.1.127/ws'; // Replace with your ESP32's IP address and port if necessary

const WebSocketChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { temperature, humidity } = data;
      console.log(temperature)
      console.log(humidity)

      setTemperatureData((prevData) => [...prevData, temperature]);
      setHumidityData((prevData) => [...prevData, humidity]);
      setTimestamps((prevData) => [...prevData, new Date().toLocaleTimeString()]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Humidity (%)',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2>Real-Time Temperature and Humidity Data</h2>
      <Line data={data} />
    </div>
  );
};

export default WebSocketChart;
