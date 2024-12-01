"use strict";
/* exported data */
// Retrieve workouts from local storage or initialize with default values
const getWorkouts = () => {
    try {
        const workoutsJSON = localStorage.getItem('workout-storage');
        if (workoutsJSON) {
            const parsed = JSON.parse(workoutsJSON);
            if (Array.isArray(parsed.entries) && typeof parsed.nextEntryId === 'number') {
                return { ...parsed, editEntry: null };
            }
        }
        // Initialize with default values if no valid data found
        return { entries: [], nextEntryId: 1, editEntry: null };
    }
    catch (err) {
        console.error('Error parsing workouts from localStorage:', err);
        return { entries: [], nextEntryId: 1, editEntry: null };
    }
};
const workouts = getWorkouts(); // Load workouts initially
// Calculate power zones based on FTP
const calculateZones = (ftp) => {
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
const writeWorkouts = () => {
    const workoutsJSON = JSON.stringify(workouts);
    localStorage.setItem('workout-storage', workoutsJSON);
};
// Add a new workout to the list
const addWorkout = (workout) => {
    const existingWorkoutIndex = workouts.entries.findIndex((w) => w.entryId === workout.entryId);
    if (existingWorkoutIndex !== -1) {
        // Update existing workout
        workouts.entries[existingWorkoutIndex] = workout;
        console.log(`Updated workout with entryId ${workout.entryId}`);
    }
    else {
        // Add new workout
        workout.entryId = workouts.nextEntryId++;
        workouts.entries.push(workout);
        console.log(`Added new workout with entryId ${workout.entryId}`);
    }
    writeWorkouts(); // Update local storage
};
