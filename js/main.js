'use strict';
const $ftpInput = document.querySelector('.ftp');
const $zoneElements = document.querySelectorAll('.zone');
const $openModal = document.querySelector('.open-today-modal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('.modal');
const $saveWorkout = document.querySelector('#save-workout');
const $form = document.querySelector('#entry-form');
const $title = document.querySelector('.modal__title');
const $deleteModal = document.querySelector('.delete-confirmation-modal');
const $dismissDeleteModal = document.querySelector('.dismiss-delete-modal');
const $confirmDeleteModal = document.querySelector('.confirm-delete-modal');
let entryIdToDelete = null;
if (!$saveWorkout) throw new Error('$saveWorkout elements did not query!');
if (!$form) throw new Error('$form did not query!');
if (!$title) throw new Error('$title did not query!');
if (!$openModal) throw new Error('$openModal did not query!');
const loadWorkouts = () => {
  try {
    const $newEntriesContainer = document.querySelector(
      '.workout-section__entries',
    );
    if (!$newEntriesContainer) {
      console.error('$newEntriesContainer did not query!');
      return;
    }
    $newEntriesContainer.innerHTML = ''; // Clear previous entries
    const { entries } = getWorkouts();
    entries.forEach((workout) => {
      const $workout = document.createElement('li');
      // Hold the title
      const $textContent = document.createElement('h3');
      $textContent.textContent = workout.title;
      $workout.classList.add('workout-entry');
      $workout.setAttribute('data-entry', String(workout.entryId));
      // Add trash icon for deleting
      const $deleteIcon = document.createElement('i');
      $deleteIcon.classList.add('fa-solid', 'fa-trash');
      $deleteIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteEntry(workout.entryId);
      });
      // Create title and pencil icon container
      const $titleContainer = document.createElement('h3');
      $titleContainer.classList.add('entry-frame');
      $titleContainer.appendChild($deleteIcon);
      $titleContainer.appendChild($textContent);
      // Add pencil icon for editing
      const $editIcon = document.createElement('i');
      $editIcon.classList.add('fa-solid', 'fa-pencil');
      // Check if the workout is completed
      if (isWorkoutCompleted(workout)) {
        $workout.classList.add('workout-completed'); // Apply green class
        // Do NOT append the pencil icon if completed
      } else {
        // Append the icon and make it functional for non-completed workouts
        $editIcon.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent triggering the parent click event
          workouts.editEntry = workout.entryId;
          writeWorkouts();
          viewSwap('edit', workout); // Switch to edit mode
          $dialog?.showModal(); // Show the modal
        });
        $titleContainer.appendChild($editIcon); // Append pencil icon
      }
      // Append title container to the workout
      $workout.appendChild($titleContainer);
      // Add click event to open the workout modal
      $workout.addEventListener('click', () => showWorkoutInModal(workout));
      $newEntriesContainer.appendChild($workout);
    });
  } catch (err) {
    console.error('Error in loadWorkouts:', err);
    alert('Failed to load data!');
  }
};
const showWorkoutInModal = (workout) => {
  $dialog.setAttribute('data-entry', String(workout.entryId));
  // Default to view mode when an entry is clicked
  viewSwap('view', workout);
  $dialog?.showModal();
};
const enableCompletedSection = (isEditable) => {
  const $completedSection = document.querySelector('.modal__group.completed');
  if ($completedSection) {
    Array.from($completedSection.querySelectorAll('input')).forEach(
      (element) => {
        if (element instanceof HTMLInputElement) {
          element.readOnly = !isEditable; // Toggle read-only based on isEditable
        }
      },
    );
  }
};
document.addEventListener('DOMContentLoaded', loadWorkouts);
const saveWorkout = (e) => {
  e.preventDefault();
  const data = new FormData($form);
  const entryId = Number($dialog.getAttribute('data-entry'));
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
    entryId,
    completion: {
      hrs: Number(data.get('hours-completed')) || 0,
      mins: Number(data.get('minutes-completed')) || 0,
      secs: Number(data.get('seconds-completed')) || 0,
      distance: Number(data.get('distance-completed')) || 0,
    },
  };
  if (!validateWorkout(newWorkout)) {
    alert('Please provide valid workout data.');
    return;
  }
  const index = workouts.entries.findIndex(
    (workout) => workout.entryId === entryId,
  );
  if (index !== -1) {
    // Update existing workout
    workouts.entries[index] = newWorkout;
  } else if (entryId === workouts.nextEntryId) {
    // Add a new workout
    workouts.entries.push(newWorkout);
    workouts.nextEntryId++; // Increment nextEntryId
  } else {
    console.error(`No workout found with entryId ${entryId} to update.`);
  }
  workouts.editEntry = null; // Reset edit mode
  writeWorkouts();
  loadWorkouts();
  formReset();
  closeModal();
};
const openModal = () => {
  viewSwap('add');
  // Assign the next available entryId for new workouts
  $dialog.setAttribute('data-entry', String(workouts.nextEntryId));
  $dialog?.showModal();
};
const closeModal = () => {
  $dialog?.close();
};
const formReset = () => $form.reset();
const viewSwap = (mode, workout) => {
  const formElements = Array.from($form.elements);
  const $completedSection = document.querySelector('.modal__group.completed');
  if (mode === 'view') {
    // Determine if the workout is completed
    const isCompleted = isWorkoutCompleted(workout);
    // Make all fields read-only
    formElements.forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.readOnly = true; // All fields read-only
      }
    });
    // Show completed section and allow editing only if the workout is not completed
    if ($completedSection) {
      $completedSection.style.display = 'block';
      enableCompletedSection(!isCompleted); // Editable only if not completed
    }
    // Hide the "Save" button for completed workouts
    $saveWorkout.style.display = isCompleted ? 'none' : 'block';
    // Populate the form fields with workout data
    if (workout) populateFormFields(workout);
    // Set modal title
    $title.textContent = isCompleted
      ? `${workout?.title} (Completed)`
      : workout?.title || 'Workout Details';
  } else if (mode === 'edit') {
    // Make all fields editable except the completed section
    formElements.forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.readOnly = false; // Make fields editable
      }
    });
    // Hide completed section during editing
    if ($completedSection) $completedSection.style.display = 'none';
    // Show the "Save" button
    $saveWorkout.style.display = 'block';
    // Set modal title for editing
    $title.textContent = `Edit Workout: ${workout?.title || 'New Workout'}`;
  } else if (mode === 'add') {
    // Make all fields editable
    formElements.forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.readOnly = false; // All fields editable
        element.value = ''; // Clear fields
      }
    });
    // Hide completed section for new workouts
    if ($completedSection) $completedSection.style.display = 'none';
    // Set the modal for a new entry
    $dialog.setAttribute('data-entry', '0');
    formReset();
    $saveWorkout.style.display = 'block'; // Show save button
    $title.textContent = 'Add Workout';
  }
};
$confirmDeleteModal?.addEventListener('click', () => {
  if (entryIdToDelete !== null) {
    const index = workouts.entries.findIndex(
      (workout) => workout.entryId === entryIdToDelete,
    );
    if (index !== -1) {
      // Remove the workout from the list
      workouts.entries.splice(index, 1);
      writeWorkouts(); // Save the updated workouts
      loadWorkouts(); // Reload the workout list
    } else {
      console.error(
        `No workout found with entryId ${entryIdToDelete} to delete.`,
      );
    }
    entryIdToDelete = null; // Reset the entryIdToDelete
  }
  $deleteModal?.close(); // Close the confirmation modal
});
$dismissDeleteModal?.addEventListener('click', () => {
  entryIdToDelete = null; // Reset the entryIdToDelete
  $deleteModal?.close(); // Close the modal
});
const deleteEntry = (entryId) => {
  entryIdToDelete = entryId; // Store the ID of the workout to delete
  $deleteModal?.showModal(); // Open the confirmation modal
};
const populateFormFields = (workout) => {
  const mapping = {
    title: workout.title,
    hours: workout.duration.hrs,
    minutes: workout.duration.mins,
    seconds: workout.duration.secs,
    distance: workout.distance,
    ftp: workout.ftp,
    comment: workout.comment,
    'hours-completed': workout.completion?.hrs || '',
    'minutes-completed': workout.completion?.mins || '',
    'seconds-completed': workout.completion?.secs || '',
    'distance-completed': workout.completion?.distance || '',
  };
  Array.from($form.elements).forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const name = element.name;
      if (Object.hasOwn(mapping, name)) {
        element.value = mapping[name].toString();
      }
    }
  });
};
const validateWorkout = (workout) =>
  workout.duration.hrs >= 0 &&
  workout.duration.mins >= 0 &&
  workout.duration.secs >= 0 &&
  workout.distance >= 0;
const isWorkoutCompleted = (workout) =>
  workout?.completion
    ? workout.completion.hrs > 0 ||
      workout.completion.mins > 0 ||
      workout.completion.secs > 0 ||
      workout.completion.distance > 0
    : false;
$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$saveWorkout.addEventListener('click', saveWorkout);
$ftpInput.addEventListener('input', () => {
  const ftp = Number($ftpInput.value);
  if (ftp > 0) {
    const zones = calculateZones(ftp);
    $zoneElements.forEach((zone, index) => {
      const { min, max } = zones[index];
      zone.textContent = `Zone ${index + 1}: ${min} - ${max}`;
    });
  } else {
    alert('Invalid FTP input. Please enter a number greater than zero.');
  }
});
