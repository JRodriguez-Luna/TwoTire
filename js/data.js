"use strict";
/* exported data */
let workouts = [];
/**
 * Calculate power zones based on the user's FTP (Functional Threshold Power)
 * @param ftp - The user's FTP value
 * @returns An array of ZoneRange objects representing power zones
 */
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
/**
 * Writes the workouts array to localStorage
 */
const writeWorkouts = () => {
    const workoutsJSON = JSON.stringify(workouts);
    localStorage.setItem('workout-storage', workoutsJSON); // Use 'workout-storage' for consistency
};
/**
 * Adds a new workout to the workouts array and writes to localStorage
 * @param workout - A Workout object to be added
 */
const addWorkout = (workout) => {
    workouts.push(workout);
    writeWorkouts();
};
/**
 * Retrieves workouts from localStorage
 * @returns An array of Workout objects or an empty array if none exist
 */
const getWorkouts = () => {
    const workoutsJSON = localStorage.getItem('workout-storage'); // Matching the key used in writeWorkouts
    if (workoutsJSON)
        return JSON.parse(workoutsJSON);
    return [];
};
