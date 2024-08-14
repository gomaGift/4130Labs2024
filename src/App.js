// src/App.js
import React from 'react';
import './App.css';
import WebSocketChart from './components/web';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WebSocketChart />
      </header>
    </div>
  );
}

export default App;
