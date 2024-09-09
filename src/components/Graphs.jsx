// src/components/Graphs.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale);

const Graphs = ({ temperatureData, humidityData, timestamps }) => {
  const temperatureChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Temperature (°C)',
        
        data: temperatureData.map((temp, index) => ({ x: timestamps[index], y: temp })),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const humidityChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Humidity (%)',
        data: humidityData.map((humidity, index) => ({ x: timestamps[index], y: humidity })),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Temperature (°C)</h2>
        <div className="h-[500px]"> {/* Increased height */}
          <Line data={temperatureChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Humidity (%)</h2>
        <div className="h-[500px]"> {/* Increased height */}
          <Line data={humidityChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default Graphs;
