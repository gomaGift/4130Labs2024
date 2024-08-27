// src/components/Navbar.js
import React from 'react';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <div className="bg-gray-900 text-white h-16 flex items-center px-4 z-20">
      <button onClick={ onToggleSidebar } className="text-2xl mr-4">
        ☰
      </button>
      <h1 className="text-lg font-semibold">Dashboard</h1>
    </div>
  );
};

export default Navbar;
