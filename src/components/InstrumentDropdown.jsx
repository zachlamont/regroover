import React, { useState, useEffect, useRef } from "react";
import { SAMPLER_INSTRUMENTS } from "../../utils/constants";

const InstrumentDropdown = ({ selectedInstrument, setSelectedInstrument }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const instrumentOptions = Object.entries(SAMPLER_INSTRUMENTS).map(
    ([key, value]) => ({
      key,
      name: value.name,
    })
  );

  const selectedInstrumentName =
    instrumentOptions.find(
      (instrument) => instrument.key === selectedInstrument
    )?.name || "Select an Instrument";

  const handleChange = (key) => {
    setSelectedInstrument(key);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="text-white bg-black bg-opacity-30 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm py-2 px-5 text-center inline-flex items-center border border-white border-opacity-30 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedInstrumentName}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {dropdownOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 min-w-min rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {instrumentOptions.map((instrument) => (
              <a
                key={instrument.key}
                href="#"
                className="text-white block px-4 py-2 text-sm hover:bg-gray-700 whitespace-nowrap"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleChange(instrument.key);
                  setDropdownOpen(false);
                }}
              >
                {instrument.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstrumentDropdown;
