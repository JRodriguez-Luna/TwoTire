"use strict";
const $ftpInput = document.querySelector('.ftp-input');
const $zoneElements = document.querySelectorAll('.zone');
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');
// workout elements
const $saveWorkout = document.querySelector('#save-workout');
const $form = document.querySelector('#entry-form');
// Check if valid
if (!$saveWorkout)
    throw new Error('$saveWorkout did not query!');
if (!$form)
    throw new Error('$form did not query!');
// Save Workout
const saveWorkout = (e) => {
    e.preventDefault();
    const data = new FormData($form);
    const newWorkout = {
        date: formatDate(),
        title: String(data.get('title')),
        duration: {
            hrs: Number(data.get('hours')) || 0,
            mins: Number(data.get('minutes')) || 0,
            secs: Number(data.get('seconds')) || 0
        },
        distance: Number(data.get('distance')) || 0,
        avgSpeed: Number(data.get('avg-speed')) || 0,
        avgCadence: Number(data.get('avg-cadence')) || 0,
        avgHR: Number(data.get('avg-HR')) || 0,
        elevGain: Number(data.get('elevation-gain')) || 0,
        ftp: Number(data.get('ftp-input')) || 220,
        comment: String(data.get('comment')) || '',
    };
    addWorkout(newWorkout);
    formReset();
    $dialog?.close();
    // Check to see if workout saved
    console.log('Workout saved:', newWorkout);
};
// Date
const $modalTitleDate = document.querySelector('.modal-title');
if (!$modalTitleDate)
    throw new Error('$modalTitleDate did not query!');
const formatDate = () => {
    const today = new Date();
    return today.toDateString(); // Set current date
};
// Modal
// Call the function to initialize the map when the modal is opened
const openModal = () => {
    $modalTitleDate.textContent = formatDate();
    $dialog?.showModal();
    initializeMap();
};
const closeModal = () => {
    $dialog?.close();
};
// FTP Calculation with arrow function
const ftpInput = () => {
    try {
        const ftp = Number($ftpInput.value);
        // is a valid number?
        if (!isNaN(ftp) && ftp > 0) {
            console.log(`FTP Value: ${ftp}`);
            const zones = calculateZones(ftp); // min, max values
            // Update the DOM elements with new zone values
            $zoneElements.forEach((zone, index) => {
                const { min, max } = zones[index];
                zone.textContent = `Zone ${index + 1}: ${min} - ${max}`;
            });
        }
        else {
            throw new Error('Invalid Input. Please enter a valid number greater than zero.');
        }
    }
    catch (error) {
        console.error(error.message);
    }
};
const formReset = () => {
    $form.reset();
};
$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', ftpInput);
$saveWorkout.addEventListener('click', saveWorkout);
