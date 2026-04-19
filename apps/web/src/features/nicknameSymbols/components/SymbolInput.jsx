import React from 'react';

export const SymbolInput = ({ value, onChange }) => (
  <input 
    type="text" 
    value={value} 
    onChange={(e) => onChange(e.target.value)} 
    placeholder="Enter nickname..."
    className="w-full p-2 border rounded"
  />
);