import React from 'react';

export default function TimeFilterButtons({ activeTimeFilter, onFilterChange }) {
  const timeOptions = [2, 4, 6];

  return (
    <div className="flex gap-2">
      {timeOptions.map((hours) => (
        <button
          key={hours}
          onClick={() => onFilterChange(hours)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTimeFilter === hours
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          &lt; {hours}h
        </button>
      ))}
      <button
        onClick={() => onFilterChange(null)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          activeTimeFilter === null
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        All
      </button>
    </div>
  );
}