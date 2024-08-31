import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import ChordSection from "./ChordSection";
import DrumSection from "./DrumSection";
import BpmSelector from "./BpmSelector"; // Import the BpmSelector component

const Regroover = () => {
  const [selectedBPM, setSelectedBPM] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("pop");

  useEffect(() => {
    console.log("selectedBPM:", selectedBPM);
    console.log("isPlaying:", isPlaying);
    Tone.Transport.bpm.value = selectedBPM;
    isPlaying ? Tone.Transport.start() : Tone.Transport.stop();
  }, [selectedBPM, isPlaying]);

  return (
    <div className="regroover">
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <BpmSelector selectedBPM={selectedBPM} setSelectedBPM={setSelectedBPM} />

      <ChordSection isPlaying={isPlaying} genre={selectedGenre} />
      <DrumSection genre={selectedGenre} />
    </div>
  );
};

export default Regroover;

