import React, { useState, useEffect, useRef } from "react";
import GenreDropdown from "./GenreDropdown";
import ProgressionDropdown from "./ProgressionDropdown";
import InstrumentDropdown from "./InstrumentDropdown";
import RhythmDropdown from "./RhythmDropdown";
import * as Tone from "tone";
import { SAMPLER_INSTRUMENTS } from "../../utils/constants";
import processLeft from "../../utils/processLeft"; // Adjust the path as necessary

const ChordSection = ({ isPlaying }) => {
  const [selectedGenre, setSelectedGenre] = useState("Country");
  const [selectedProgressionId, setSelectedProgressionId] = useState(3);
  const [selectedInstrument, setSelectedInstrument] = useState("piano");
  const [selectedRhythmId, setSelectedRhythmId] = useState(1);
  const [samplersLoaded, setSamplersLoaded] = useState(false);
  const samplersRef = useRef({});

  // Preload all samplers when the component mounts
  useEffect(() => {
    const preloadSamplers = async () => {
      for (const instrument in SAMPLER_INSTRUMENTS) {
        const { samples } = SAMPLER_INSTRUMENTS[instrument];
        const sampler = new Tone.Sampler({
          urls: samples,
          baseUrl: `/Samples/${instrument}/`,
        }).toDestination();

        await Tone.loaded();
        samplersRef.current[instrument] = sampler;
      }
      console.log("All samplers preloaded");
      setSamplersLoaded(true);
    };

    preloadSamplers();

    // Cleanup function
    return () => {
      for (const sampler in samplersRef.current) {
        samplersRef.current[sampler].dispose();
      }
    };
  }, []);

  // Update the active sampler when the selected instrument changes
  useEffect(() => {
    const activeSampler = samplersRef.current[selectedInstrument];
    if (activeSampler) {
      console.log(`${selectedInstrument} sampler is ready for playback`);
    }
  }, [selectedInstrument]);

  // Process the left-hand notes when relevant state changes
  useEffect(() => {
    if (!samplersLoaded) return;

    const processedNotesLeft = processLeft(
      selectedGenre,
      selectedProgressionId,
      selectedRhythmId
    );
    // Here you can use processedNotesLeft to schedule the notes or for other purposes
    console.log("Processed notes for left hand:", processedNotesLeft);
  }, [selectedGenre, selectedProgressionId, selectedRhythmId, samplersLoaded]);

  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  }, [isPlaying]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Chord Section - Genre: {selectedGenre}
      </h2>
      <GenreDropdown
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />
      {selectedGenre && (
        <ProgressionDropdown
          genre={selectedGenre}
          selectedProgressionId={selectedProgressionId}
          setSelectedProgressionId={setSelectedProgressionId}
        />
      )}
      <InstrumentDropdown
        selectedInstrument={selectedInstrument}
        setSelectedInstrument={setSelectedInstrument}
      />
      <RhythmDropdown
        selectedRhythmId={selectedRhythmId}
        setSelectedRhythmId={setSelectedRhythmId}
      />
    </div>
  );
};

export default ChordSection;
