import React from 'react';
import NameCard from './NameCard.jsx';

const NamesGrid = ({ names, color }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {names.map((name, idx) => (
        <NameCard key={idx} name={name} color={color} />
      ))}
    </div>
  );
};

export default NamesGrid;