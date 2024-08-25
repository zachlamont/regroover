import React, { useState, useEffect, useRef } from "react";
import { drumPatterns } from "../../utils/constants";

const DrumGenreDropdown = ({ drumGenre, setDrumGenre }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const genres = Object.keys(drumPatterns);

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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {drumGenre || "Select Drum Genre"}
        <svg
          className={`ml-2 w-5 h-5 transform ${
            dropdownOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06 0L10 10.94l3.71-3.73a.75.75 0 011.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {dropdownOpen && (
        <div
          className="absolute mt-2 w-full rounded-md shadow-lg bg-cyan-500 ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {genres.map((genre) => (
              <div
                key={genre}
                role="menuitem"
                className={`block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  drumGenre === genre
                    ? "font-bold text-indigo-600"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setDrumGenre(genre);
                  setDropdownOpen(false);
                }}
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrumGenreDropdown;
