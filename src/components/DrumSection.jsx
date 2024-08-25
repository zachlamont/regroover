// src/components/DrumSection.jsx
import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import DrumGenreDropdown from "./DrumGenreDropdown";
import DrumPatternDropdown from "./DrumPatternDropdown";
import SampleSelector from "./SampleSelector";

const players = {
  funk: {
    kick: new Tone.Player("Samples/kick/funk.wav").toDestination(),
    snare: new Tone.Player("Samples/snare/funk.wav").toDestination(),
    hat: new Tone.Player("Samples/hat/funk.wav").toDestination(),
    clap: new Tone.Player("Samples/clap/funk.wav").toDestination(),
  },
  hiphop: {
    kick: new Tone.Player("Samples/kick/hiphop.wav").toDestination(),
    snare: new Tone.Player("Samples/snare/hiphop.wav").toDestination(),
    hat: new Tone.Player("Samples/hat/hiphop.wav").toDestination(),
    clap: new Tone.Player("Samples/clap/hiphop.wav").toDestination(),
  },
  rock: {
    kick: new Tone.Player("Samples/kick/rock.wav").toDestination(),
    snare: new Tone.Player("Samples/snare/rock.wav").toDestination(),
    hat: new Tone.Player("Samples/hat/rock.wav").toDestination(),
    clap: new Tone.Player("Samples/clap/rock.wav").toDestination(),
  },
  jazz: {
    kick: new Tone.Player("Samples/kick/jazz.wav").toDestination(),
    snare: new Tone.Player("Samples/snare/jazz.wav").toDestination(),
    hat: new Tone.Player("Samples/hat/jazz.wav").toDestination(),
    clap: new Tone.Player("Samples/clap/jazz.wav").toDestination(),
  },
};

const TICK_CONVERSION_FACTOR = 960 / 192;

const DrumSection = () => {
  const [drumGenre, setDrumGenre] = useState("rock");
  const [selectedDrumPattern, setSelectedDrumPattern] = useState(null);
  const [selectedSamples, setSelectedSamples] = useState({
    kick: "funk",
    snare: "funk",
    hat: "funk",
    clap: "funk",
  });

  useEffect(() => {
    if (selectedDrumPattern) {
      Tone.Transport.cancel(); // Clear any previously scheduled events

      const scheduleNotes = (instrument, pattern) => {
        pattern.forEach((note) => {
          const time =
            note.timeTicks / TICK_CONVERSION_FACTOR / Tone.Transport.PPQ;
          if (players[selectedSamples[instrument]][instrument].loaded) {
            Tone.Transport.schedule((time) => {
              players[selectedSamples[instrument]][instrument].start(
                time,
                0,
                "8n",
                0,
                note.velocity
              );
            }, time);
          }
        });
      };

      scheduleNotes("kick", selectedDrumPattern.kick);
      scheduleNotes("snare", selectedDrumPattern.snare);
      scheduleNotes("hat", selectedDrumPattern.hat);
      scheduleNotes("clap", selectedDrumPattern.clap);
    }

    return () => {
      Tone.Transport.cancel(); // Cleanup scheduled events
    };
  }, [selectedSamples, selectedDrumPattern]);

  return (
    <div>
      <DrumGenreDropdown drumGenre={drumGenre} setDrumGenre={setDrumGenre} />
      {drumGenre && (
        <DrumPatternDropdown
          drumGenre={drumGenre}
          selectedDrumPattern={selectedDrumPattern}
          setSelectedDrumPattern={setSelectedDrumPattern}
        />
      )}
      <div>Drum Section - Genre: {drumGenre}</div>
      {selectedDrumPattern && (
        <div>
          <div>Pattern: {selectedDrumPattern.name}</div>
          <pre>{JSON.stringify(selectedDrumPattern, null, 2)}</pre>
        </div>
      )}
      <SampleSelector
        selectedSamples={selectedSamples}
        setSelectedSamples={setSelectedSamples}
      />
      {selectedSamples && (
        <div>
          <div>Selected Samples:</div>
          <pre>{JSON.stringify(selectedSamples, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DrumSection;
