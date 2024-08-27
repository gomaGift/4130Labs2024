import React from 'react';

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-64'} w-64`}>
      <div className="p-4">
        <h2 className="text-2xl font-bold">Sidebar</h2>
        {/* Add sidebar content here */}
      </div>
    </div>
  );
};

export default Sidebar;
