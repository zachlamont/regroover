import { customProgressions, chordRhythms } from "../utils/constants";

const processLeft = (
  selectedGenre,
  selectedProgressionId,
  selectedRhythmId
) => {
  // Find the corresponding chord progression
  const genreData = customProgressions.find(
    (genre) => genre.genre === selectedGenre
  );
  if (!genreData) return;

  const progression = genreData.chordProgressions.find(
    (prog) => prog.id === selectedProgressionId
  );
  if (!progression) return;

  // Find the corresponding chord rhythm
  const rhythm = chordRhythms.find((r) => r.id === selectedRhythmId);
  if (!rhythm) return;

  const { notesLeft } = rhythm;

  // Process the notes
  const processedNotesLeft = notesLeft.map((notesArray, chordIndex) => {
    const chord = progression.chords[chordIndex];
    return notesArray.map((note) => {
      const { chordTone, durationTicks, timeTicks } = note;
      let midiValue;
      if (chordTone === 1) {
        midiValue = chord.midiKeys[0] - 24;
      } else if (chordTone === 2) {
        midiValue = chord.midiKeys[0] - 12;
      } else {
        midiValue = chord.midiKeys[chordTone - 1];
      }
      return {
        midi: midiValue,
        durationTicks,
        timeTicks,
      };
    });
  });

  console.log("ProcessedNotesLeft:", processedNotesLeft);

  return processedNotesLeft;
};

const processRight = (
  selectedGenre,
  selectedProgressionId,
  selectedRhythmId
) => {
  // Find the corresponding chord progression
  const genreData = customProgressions.find(
    (genre) => genre.genre === selectedGenre
  );
  if (!genreData) return;

  const progression = genreData.chordProgressions.find(
    (prog) => prog.id === selectedProgressionId
  );
  if (!progression) return;

  // Find the corresponding chord rhythm
  const rhythm = chordRhythms.find((r) => r.id === selectedRhythmId);
  if (!rhythm) return;

  const { notesRight } = rhythm;

  // Process the notes
  const processedNotesRight = notesRight.map((notesArray, chordIndex) => {
    const chord = progression.chords[chordIndex];
    return notesArray
      .map((note) => {
        const { chordTone, durationTicks, timeTicks } = note;
        const midi = chord.midiKeys[chordTone - 1];
        if (midi === undefined) {
          console.log(`No MIDI note found at index ${chordTone - 1}`);
          return null; // Skip this note
        }
        return {
          midi,
          durationTicks,
          timeTicks,
        };
      })
      .filter((note) => note !== null); // Filter out any null notes
  });

  console.log("ProcessedNotesRight:", processedNotesRight);

  return processedNotesRight;
};

export default processLeft;
export { processRight };
