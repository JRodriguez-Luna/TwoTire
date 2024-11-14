/* exported data */

interface ZoneRange {
  min: number;
  max: number;
}

interface Workouts {
  title: string;
  duration: {
    hrs: number;
    mins: number;
    secs: number;
  };
  distance: number;
  ftp: number;
  comment: string;
  entryId: number;
}

interface EntryWorkout {
  entries: Workouts[];
  nextEntryId: number;
}

// Retrieve workouts from local storage or initialize with default values
const getWorkouts = (): EntryWorkout => {
  const workoutsJSON = localStorage.getItem('workout-storage');
  if (workoutsJSON) {
    return JSON.parse(workoutsJSON);
  } else {
    return {
      entries: [],
      nextEntryId: 1,
    };
  }
};

const workouts: EntryWorkout = getWorkouts(); // Load workouts initially

// Calculate power zones based on FTP
const calculateZones = (ftp: number): ZoneRange[] => {
  return [
    { min: 0, max: Math.round(ftp * 0.55) }, // Zone 1: Recovery (0-55% FTP)
    { min: Math.round(ftp * 0.55) + 1, max: Math.round(ftp * 0.75) }, // Zone 2: Endurance (56%-75%)
    { min: Math.round(ftp * 0.75) + 1, max: Math.round(ftp * 0.9) }, // Zone 3: Tempo (76%-90%)
    { min: Math.round(ftp * 0.9) + 1, max: Math.round(ftp * 1.05) }, // Zone 4: Threshold (91%-105%)
    { min: Math.round(ftp * 1.05) + 1, max: Math.round(ftp * 1.2) }, // Zone 5: VO2 Max (106%-120%)
    { min: Math.round(ftp * 1.2) + 1, max: Math.round(ftp * 1.5) }, // Zone 6: Anaerobic (121%-150%)
    { min: Math.round(ftp * 1.5) + 1, max: Infinity }, // Zone 7: Neuromuscular (151%+)
  ];
};

// Write the updated workouts to local storage
const writeWorkouts = (): void => {
  const workoutsJSON = JSON.stringify(workouts);
  localStorage.setItem('workout-storage', workoutsJSON);
};

// Add a new workout to the list
const addWorkout = (workout: Workouts): void => {
  workout.entryId = workouts.nextEntryId; // Assign the next available entryId
  workouts.entries.push(workout); // Add to the entries array
  workouts.nextEntryId++; // Increment the next entryId
  writeWorkouts(); // Update local storage
};
