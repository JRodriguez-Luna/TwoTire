/* exported data */

interface ZoneRange {
  min: number;
  max: number;
}

interface Workout {
  date: string;
  title: string;
  duration: {
    hrs: number;
    mins: number;
    secs: number;
  };
  distance: number;
  ftp: number;
  comment: string;
}

let workouts: Workout[] = [];

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

const writeWorkouts = (): void => {
  const workoutsJSON = JSON.stringify(workouts);
  localStorage.setItem('workout-storage', workoutsJSON); // Use 'workout-storage' for consistency
};

const addWorkout = (workout: Workout): void => {
  workouts.push(workout);
  writeWorkouts();
};

const getWorkouts = (): Workout[] => {
  const workoutsJSON = localStorage.getItem('workout-storage'); // Matching the key used in writeWorkouts
  if (workoutsJSON) return JSON.parse(workoutsJSON);

  return [];
};
