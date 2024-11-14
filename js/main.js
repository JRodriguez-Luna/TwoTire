"use strict";
const $ftpInput = document.querySelector('.ftp');
const $zoneElements = document.querySelectorAll('.zone');
const $openModal = document.querySelector('.open-today-modal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('.modal');
const $saveWorkout = document.querySelector('#save-workout');
const $form = document.querySelector('#entry-form');
const $title = document.querySelector('.modal__title');
if (!$saveWorkout)
    throw new Error('$saveWorkout elements did not query!');
if (!$form)
    throw new Error('$form did not query!');
if (!$title)
    throw new Error('$title did not query!');
if (!$openModal)
    throw new Error('$openModal did not query!');
const loadWorkouts = () => {
    try {
        const $newEntriesContainer = document.querySelector('.workout-section__entries');
        if (!$newEntriesContainer) {
            console.error('$newEntriesContainer did not query!');
            return;
        }
        $newEntriesContainer.innerHTML = '';
        const { entries } = getWorkouts();
        entries.forEach((workout) => {
            const $workout = document.createElement('li');
            $workout.classList.add('workout-entry');
            $workout.textContent = `${workout.title}`;
            $newEntriesContainer.appendChild($workout);
            $workout.addEventListener('click', () => showWorkoutInModal(workout));
        });
    }
    catch (err) {
        console.log('Failed to load data!:', err);
    }
};
const showWorkoutInModal = (workout) => {
    const mapping = {
        title: workout.title,
        hours: workout.duration.hrs,
        minutes: workout.duration.mins,
        seconds: workout.duration.secs,
        distance: workout.distance,
        ftp: workout.ftp,
        comment: workout.comment,
    };
    const formElements = $form.elements;
    // Loop through each form element and set the value if it matches a key in the mapping
    for (const element of formElements) {
        if (element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement) {
            const name = element.name;
            if (Object.hasOwn(mapping, name)) {
                element.value = mapping[name].toString();
            }
        }
    }
    // Make form inputs read-only
    Array.from(formElements).forEach((element) => {
        if (element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement) {
            element.readOnly = true;
        }
    });
    // Hide the save button since we're in read-only mode
    $saveWorkout.style.display = 'none';
    // Set the modal title
    $title.textContent = `${workout.title}`;
    // Open the modal
    $dialog?.showModal();
};
document.addEventListener('DOMContentLoaded', loadWorkouts);
const saveWorkout = (e) => {
    e.preventDefault();
    const data = new FormData($form);
    const newWorkout = {
        title: String(data.get('title')),
        duration: {
            hrs: Number(data.get('hours')) || 0,
            mins: Number(data.get('minutes')) || 0,
            secs: Number(data.get('seconds')) || 0,
        },
        distance: Number(data.get('distance')) || 0,
        ftp: Number(data.get('ftp')) || 220,
        comment: String(data.get('comment')) || '',
        entryId: 0, // This will be set by the addWorkout function
    };
    addWorkout(newWorkout); // Add the new workout to the storage
    loadWorkouts(); // Reload the workouts to display the updated list
    formReset(); // Reset the form fields
    $dialog?.close(); // Close the modal
};
const openModal = () => {
    formReset();
    $dialog?.showModal();
};
const closeModal = () => {
    $dialog?.close();
};
const ftpInput = () => {
    const ftp = Number($ftpInput.value);
    if (!isNaN(ftp) && ftp > 0) {
        const zones = calculateZones(ftp);
        $zoneElements.forEach((zone, index) => {
            const { min, max } = zones[index];
            zone.textContent = `Zone ${index + 1}: ${min} - ${max}`;
        });
    }
    else {
        console.error('Invalid FTP input. Please enter a number greater than zero.');
    }
};
const formReset = () => {
    $form.reset();
};
// Event Listeners
$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', ftpInput);
$saveWorkout.addEventListener('click', saveWorkout);
