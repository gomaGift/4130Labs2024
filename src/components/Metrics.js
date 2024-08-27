// src/components/Metrics.js
import React from 'react';

const Metrics = ({ tempStats, humidityStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Temperature</h2>
        <div className="mb-4">
          <div className="bg-gray-100 p-4 rounded-lg mb-2">
            <h3 className="text-md font-semibold">Current</h3>
            <p>{tempStats.current} °C</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-2">
            <h3 className="text-md font-semibold">Min</h3>
            <p>{tempStats.min} °C</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-2">
            <h3 className="text-md font-semibold">Max</h3>
            <p>{tempStats.max} °C</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-md font-semibold">Avg</h3>
            <p>{tempStats.avg.toFixed(2)} °C</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Humidity</h2>
        <div className="mb-4">
          <div className="bg-gray-100 p-4 rounded-lg mb-2">
            <h3 className="text-md font-semibold">Current</h3>
            <p>{humidityStats.current} %</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-2">
            <h3 className="text-md font-semibold">Min</h3>
            <p>{humidityStats.min} %</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-2">
            <h3 className="text-md font-semibold">Max</h3>
            <p>{humidityStats.max} %</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-md font-semibold">Avg</h3>
            <p>{humidityStats.avg.toFixed(2)} %</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
