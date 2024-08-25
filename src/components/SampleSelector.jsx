import React, { useState, useEffect, useRef } from 'react';

const drumKits = {
  Rock: { kick: 'rock', snare: 'rock', hat: 'rock', clap: 'rock' },
  Funk: { kick: 'funk', snare: 'funk', hat: 'funk', clap: 'funk' },
  Hiphop: { kick: 'hiphop', snare: 'hiphop', hat: 'hiphop', clap: 'hiphop' },
  Jazz: { kick: 'jazz', snare: 'jazz', hat: 'jazz', clap: 'jazz' }
};

const SampleSelector = ({ selectedSamples, setSelectedSamples }) => {
  const [selectedKit, setSelectedKit] = useState('Rock');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedSamples(drumKits[selectedKit]);
  }, [selectedKit, setSelectedSamples]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditOpen(false);
      }
    };

    if (isOpen || isEditOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isEditOpen]);

  const handleKitChange = (kit) => {
    setSelectedKit(kit);
    setIsOpen(false);
  };

  const handleSampleChange = (instrument, direction) => {
    const samples = Object.values(drumKits).map((kit) => kit[instrument]);
    const currentSampleIndex = samples.indexOf(selectedSamples[instrument]);
    let newSampleIndex = currentSampleIndex + direction;
    if (newSampleIndex < 0) newSampleIndex = samples.length - 1;
    if (newSampleIndex >= samples.length) newSampleIndex = 0;
    console.log(samples[newSampleIndex]);
    setSelectedSamples({
      ...selectedSamples,
      [instrument]: samples[newSampleIndex]
    });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <label>Kit:</label>
        <button
          type="button"
          className="ml-4 py-2 px-4 text-white text-sm bg-black bg-opacity-30 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-center inline-flex items-center border border-white border-opacity-30"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => {
            setIsOpen(!isOpen);
            if (isEditOpen) setIsEditOpen(false);
          }}
        >
          {selectedKit}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="button"
          className="mb-1 ml-4 py-2 px-4 text-white text-sm bg-black bg-opacity-30 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-center inline-flex items-center border border-white border-opacity-30"
          id="edit-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => {
            setIsEditOpen(!isEditOpen);
            if (isOpen) setIsOpen(false);
          }}
        >
          Edit
        </button>
      </div>

      {isOpen && (
        <div
          className="cursor-pointer origin-top-left absolute left-10 mt-1 min-w-min rounded-md shadow-lg bg-slate-800 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {Object.keys(drumKits).map((kit) => (
            <a
              key={kit}
              onClick={() => handleKitChange(kit)}
              className="block px-4 py-2 text-sm text-slate-200 rounded-md hover:bg-slate-500 hover:text-slate-100"
              role="menuitem"
            >
              {kit}
            </a>
          ))}
        </div>
      )}

      {isEditOpen && (
        <div className="cursor-pointer origin-top-left absolute left-10 mt-1 min-w-min rounded-md shadow-lg bg-slate-800 focus:outline-none z-50">
          {Object.keys(selectedSamples).map((instrument) => (
            <div
              className="flex justify-start items-center px-4 py-2 text-xs text-right text-slate-200 rounded-md hover:bg-slate-500 hover:text-slate-100"
              key={instrument}
              style={{ gap: '10px' }} // Ensure consistent spacing between items
            >
              <span className="flex-1">{instrument}</span>
              <div className="flex items-center border border-gray-300 rounded-full border-opacity-50">
                {' '}
                {/* Adjust padding here */}{' '}
                {/* possible to reduce amount of space between this div and its contents?? */}
                <button
                  className="flex-shrink-0 mt-1"
                  onClick={() => handleSampleChange(instrument, -1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 100 125"
                    xmlSpace="preserve"
                    width="25"
                    height="25"
                    opacity="0.6"
                  >
                    <path
                      d="M10,50c0,22.092,17.908,40,40,40s40-17.908,40-40S72.092,10,50,10S10,27.908,10,50z M61.662,26.232
              c0.832,0.832,1.248,1.922,1.248,3.011c0,1.09-0.416,2.18-1.248,3.011L43.918,49.999l17.744,17.744c1.664,1.664,1.664,4.359,0,6.023
              c-1.664,1.664-4.359,1.664-6.023,0L34.884,53.011c-1.664-1.664-1.664-4.359,0-6.023l20.756-20.756
              C57.303,24.568,59.998,24.568,61.662,26.232z"
                      fill="white"
                    />
                  </svg>
                </button>
                <span className="flex-1 text-center text-xs">
                  {selectedSamples[instrument]}
                </span>
                <button
                  className="flex-shrink-0 mt-1"
                  onClick={() => handleSampleChange(instrument, 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 100 125"
                    xmlSpace="preserve"
                    width="25"
                    height="25"
                    opacity="0.6"
                  >
                    <path
                      d="M90,50c0-22.092-17.908-40-40-40S10,27.908,10,50s17.908,40,40,40S90,72.092,90,50z M38.338,73.768
              c-0.832-0.832-1.248-1.922-1.248-3.011s0.416-2.18,1.248-3.011l17.744-17.744L38.338,32.257c-1.664-1.664-1.664-4.359,0-6.023
              c1.664-1.664,4.359-1.664,6.023,0l20.756,20.756c1.664,1.664,1.664,4.359,0,6.023L44.361,73.768
              C42.697,75.432,40.002,75.432,38.338,73.768z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SampleSelector;
