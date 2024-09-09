import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Graphs from './components/Graphs';
import Metrics from './components/Metrics';
import './index.css'; // Ensure Tailwind styles are included

const SOCKET_URL = 'ws://192.168.1.127/ws'; // ESP32 IP

const App = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ws, setWs] = useState(null); // WebSocket instance
  const [bulbOn, setBulbOn] = useState(false); // Bulb state

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);  // WebSocket connection with the ESP32

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data); // Parse incoming data from ESP32
      const { temperature, humidity } = data;

      setTemperatureData((prevData) => [...prevData, temperature]);
      setHumidityData((prevData) => [...prevData, humidity]);
      setTimestamps((prevData) => [...prevData, new Date().toLocaleTimeString()]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');  // Close WebSocket on disconnect
    };

    setWs(ws); // Save WebSocket instance

    return () => {
      ws.close();
    };
  }, []);

  // Toggle bulb state and send command to ESP32
  const toggleBulb = () => {
    const newBulbState = !bulbOn;
    setBulbOn(newBulbState);

    if (ws) {
      const message = JSON.stringify({ bulb: newBulbState ? "on" : "off" });
      ws.send(message); // Send message to ESP32 to turn bulb on or off
    }
  };

  // Function to calculate min, max, and average
  const getStats = (data) => {
    if (data.length === 0) return { current: 0, min: 0, max: 0, avg: 0 };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const avg = data.reduce((acc, val) => acc + val, 0) / data.length;
    const current = data[data.length - 1];

    return { current, min, max, avg };
  };

  const tempStats = getStats(temperatureData);
  const humidityStats = getStats(humidityData);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'} w-full`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-10 m-5 overflow-auto">
          <div className="grid grid-cols-1 gap-10">
            <Metrics tempStats={tempStats} humidityStats={humidityStats} />
            <Graphs
              temperatureData={temperatureData}
              humidityData={humidityData}
              timestamps={timestamps}
            />
            <button
              className={`px-4 py-2 rounded ${bulbOn ? 'bg-red-500' : 'bg-green-500'}`}
              onClick={toggleBulb}
            >
              {bulbOn ? 'Turn Off Bulb' : 'Turn On Bulb'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
