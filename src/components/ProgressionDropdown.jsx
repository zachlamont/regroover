import React, { useState } from 'react';
import { customProgressions } from '../../utils/constants';

const ProgressionDropdown = ({
  genre,
  selectedProgressionId,
  setSelectedProgressionId,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const genreProgressions =
    customProgressions.find((p) => p.genre === genre)?.chordProgressions || [];

  const formatProgression = (progression) => {
    return progression
      .map((chord) => `${chord.chord}${chord.quality}`)
      .join(' ');
  };

  const handlePrevious = () => {
    const currentIndex = genreProgressions.findIndex(
      (prog) => prog.id === selectedProgressionId
    );
    const previousIndex =
      (currentIndex - 1 + genreProgressions.length) % genreProgressions.length;
    setSelectedProgressionId(genreProgressions[previousIndex].id);
  };

  const handleNext = () => {
    const currentIndex = genreProgressions.findIndex(
      (prog) => prog.id === selectedProgressionId
    );
    const nextIndex = (currentIndex + 1) % genreProgressions.length;
    setSelectedProgressionId(genreProgressions[nextIndex].id);
  };

  const currentProgressionName = genreProgressions.find(
    (prog) => prog.id === selectedProgressionId
  )
    ? formatProgression(
        genreProgressions.find((prog) => prog.id === selectedProgressionId)
          .chords
      )
    : 'Select Progression';

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handlePrevious}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
      >
        Previous
      </button>

      <div className="relative inline-block text-left">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {currentProgressionName}
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
        {dropdownOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="py-1" role="none">
              {genreProgressions.map((prog) => (
                <a
                  key={prog.id}
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedProgressionId(prog.id);
                    setDropdownOpen(false);
                  }}
                >
                  {formatProgression(prog.chords)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
      >
        Next
      </button>
      
    </div>
  );
};

export default ProgressionDropdown;
