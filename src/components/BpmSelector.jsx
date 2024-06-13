import React, { useEffect, useState } from 'react';

const BpmSelector = ({ selectedBPM, setSelectedBPM }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging) {
        const change = event.movementY;
        setSelectedBPM((bpm) => {
          const newBpm = bpm - change;
          return Math.min(160, Math.max(40, newBpm)); // Ensure BPM stays within 40-160
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setSelectedBPM]);

  const handleMouseDown = () => setIsDragging(true);

  return (
    <div className="relative inline-block text-left">
      <button
        className="text-white bg-black bg-opacity-30 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm py-2 px-5 text-center inline-flex items-center border border-white border-opacity-30 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'ns-resize' : 'pointer',
          userSelect: 'none'
        }}
      >
        <div>BPM: {selectedBPM}</div>
      </button>
    </div>
  );
};

export default BpmSelector;
