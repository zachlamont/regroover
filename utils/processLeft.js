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
      return {
        midi: chord.midiKeys[chordTone - 1],
        durationTicks,
        timeTicks,
      };
    });
  });

  console.log("ProcessedNotesLeft:", processedNotesLeft);

  return processedNotesLeft;
};

export default processLeft;
