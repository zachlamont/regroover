import React, { useState, useEffect, useRef } from "react";
import GenreDropdown from "./GenreDropdown";
import ProgressionDropdown from "./ProgressionDropdown";
import InstrumentDropdown from "./InstrumentDropdown";
import RhythmDropdown from "./RhythmDropdown";
import * as Tone from "tone";
import { SAMPLER_INSTRUMENTS } from "../../utils/constants";
import processLeft, { processRight } from "../../utils/processLeft"; // Adjust the path as necessary

const ChordSection = ({ isPlaying }) => {
  const [selectedGenre, setSelectedGenre] = useState("Country");
  const [selectedProgressionId, setSelectedProgressionId] = useState(3);
  const [selectedInstrument, setSelectedInstrument] = useState("piano");
  const [selectedRhythmId, setSelectedRhythmId] = useState(1);
  const [samplersLoaded, setSamplersLoaded] = useState(false);
  const [processedNotesLeft, setProcessedNotesLeft] = useState([]);
  const [processedNotesRight, setProcessedNotesRight] = useState([]);
  const samplersRef = useRef({});
  const partLeftRef = useRef(null);
  const partRightRef = useRef(null);

  const TICK_CONVERSION_FACTOR = 960 / 192;

  // Preload all samplers when the component mounts
  useEffect(() => {
    const preloadSamplers = async () => {
      try {
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
      } catch (error) {
        console.error("Error loading samplers:", error);
      }
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

  // Process the notes when relevant state changes
  useEffect(() => {
    if (!samplersLoaded) return;

    const processedLeft = processLeft(
      selectedGenre,
      selectedProgressionId,
      selectedRhythmId
    ).map((notesArray) =>
      notesArray.map((note) => ({
        ...note,
        timeTicks: note.timeTicks / TICK_CONVERSION_FACTOR,
        durationTicks: note.durationTicks / TICK_CONVERSION_FACTOR,
      }))
    );
    setProcessedNotesLeft(processedLeft);

    const processedRight = processRight(
      selectedGenre,
      selectedProgressionId,
      selectedRhythmId
    ).map((notesArray) =>
      notesArray.map((note) => ({
        ...note,
        timeTicks: note.timeTicks / TICK_CONVERSION_FACTOR,
        durationTicks: note.durationTicks / TICK_CONVERSION_FACTOR,
      }))
    );
    setProcessedNotesRight(processedRight);

    console.log("Processed notes for left hand:", processedLeft);
    console.log("Processed notes for right hand:", processedRight);
  }, [selectedGenre, selectedProgressionId, selectedRhythmId, samplersLoaded]);

  // Schedule notes to the transport when processedNotesLeft or processedNotesRight changes
  useEffect(() => {
    if (partLeftRef.current) {
      partLeftRef.current.dispose();
    }

    const activeSampler = samplersRef.current[selectedInstrument];
    if (!activeSampler) return;

    const eventsLeft = processedNotesLeft.flat().map((note) => ({
      time: note.timeTicks / Tone.Transport.PPQ,
      note: Tone.Frequency(note.midi, "midi").toNote(),
      duration: note.durationTicks / Tone.Transport.PPQ,
    }));

    partLeftRef.current = new Tone.Part((time, value) => {
      activeSampler.triggerAttackRelease(value.note, value.duration, time);
    }, eventsLeft);

    partLeftRef.current.loop = true;
    partLeftRef.current.loopEnd = "4m"; // Loop every 4 measures
    partLeftRef.current.start(0);

    if (partRightRef.current) {
      partRightRef.current.dispose();
    }

    const eventsRight = processedNotesRight.flat().map((note) => ({
      time: note.timeTicks / Tone.Transport.PPQ,
      note: Tone.Frequency(note.midi, "midi").toNote(),
      duration: note.durationTicks / Tone.Transport.PPQ,
    }));

    partRightRef.current = new Tone.Part((time, value) => {
      activeSampler.triggerAttackRelease(value.note, value.duration, time);
    }, eventsRight);

    partRightRef.current.loop = true;
    partRightRef.current.loopEnd = "4m"; // Loop every 4 measures
    partRightRef.current.start(0);

    return () => {
      if (partLeftRef.current) {
        partLeftRef.current.dispose();
      }
      if (partRightRef.current) {
        partRightRef.current.dispose();
      }
    };
  }, [processedNotesLeft, processedNotesRight, selectedInstrument]);

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
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          Processed Notes (Left Hand)
        </h3>
        <pre className="bg-gray-500 p-2 rounded">
          {JSON.stringify(processedNotesLeft, null, 2)}
        </pre>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          Processed Notes (Right Hand)
        </h3>
        <pre className="bg-gray-500 p-2 rounded">
          {JSON.stringify(processedNotesRight, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ChordSection;
