import axios from 'axios';

const API_BASE_URL = 'http://your-esp32-ip-address';

export const getSensorData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sensor-data`);
    return response.data; // Assuming the ESP32 sends data in JSON format
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return null;
  }
};
