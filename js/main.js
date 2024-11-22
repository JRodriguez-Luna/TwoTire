'use strict';
const $ftpInput = document.querySelector('.ftp');
const $zoneElements = document.querySelectorAll('.zone');
const $openModal = document.querySelector('.open-today-modal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('.modal');
const $saveWorkout = document.querySelector('#save-workout');
const $form = document.querySelector('#entry-form');
const $title = document.querySelector('.modal__title');
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
    $newEntriesContainer.innerHTML = '';
    const { entries } = getWorkouts();
    entries.forEach((workout) => {
      const $workout = document.createElement('li');
      $workout.classList.add('workout-entry');
      $workout.setAttribute('data-entry', String(workout.entryId));
      $workout.textContent = `${workout.title}`;
      // If complete, change to green
      if (isWorkoutCompleted(workout)) {
        $workout.classList.add('workout-completed');
      }
      $newEntriesContainer.appendChild($workout);
      $workout.addEventListener('click', () => showWorkoutInModal(workout));
    });
  } catch (err) {
    alert('Failed to load data!');
  }
};
const showWorkoutInModal = (workout) => {
  $dialog.setAttribute('data-entry', String(workout.entryId));
  viewSwap('view', workout);
  $dialog?.showModal();
};
document.addEventListener('DOMContentLoaded', loadWorkouts);
const saveWorkout = (e) => {
  e.preventDefault();
  const data = new FormData($form);
  const entryId = Number($dialog.getAttribute('data-entry'));
  // Validate inputs
  if (!data.get('title') || !data.get('hours') || !data.get('distance')) {
    alert('Please fill out all required fields!');
    return;
  }
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
    entryId: entryId || 0,
    completion: {
      hrs: Number(data.get('hours-completed')) || 0,
      mins: Number(data.get('minutes-completed')) || 0,
      secs: Number(data.get('seconds-completed')) || 0,
      distance: Number(data.get('distance-completed')) || 0,
    },
  };
  if (entryId === 0) {
    // Add a new workout
    newWorkout.entryId = workouts.nextEntryId++;
    workouts.entries.push(newWorkout);
  } else {
    // Update existing workout
    const existingWorkoutIndex = workouts.entries.findIndex(
      (workout) => workout.entryId === entryId,
    );
    if (existingWorkoutIndex !== -1) {
      workouts.entries[existingWorkoutIndex] = newWorkout;
    } else {
      console.error(`No workout found with entryId ${entryId} to update.`);
    }
  }
  // Validate workout object
  if (!validateWorkout(newWorkout)) {
    alert('Please provide valid workout data.');
    return;
  }
  writeWorkouts();
  loadWorkouts();
  formReset();
  closeModal();
};
const openModal = () => {
  viewSwap('add');
  $dialog.setAttribute('data-entry', '0');
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
  } else {
    alert('Invalid FTP input. Please enter a number greater than zero.');
  }
};
const formReset = () => {
  $form.reset();
};
// viewSwap
const viewSwap = (mode, workout) => {
  const formElements = $form.elements;
  const $completedSection = document.querySelector('.modal__group.completed');
  if (mode === 'view') {
    $dialog.setAttribute('data-entry', String(workout?.entryId || ''));
    const isCompleted = isWorkoutCompleted(workout);
    // Set fields to readonly and populate data
    Array.from(formElements).forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.readOnly = true;
      }
    });
    if (isCompleted) {
      $saveWorkout.style.display = 'none';
    } else {
      Array.from(formElements).forEach((element) => {
        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement
        ) {
          if (element.name.endsWith('-completed')) {
            element.readOnly = false;
          }
        }
      });
      $saveWorkout.style.display = 'block';
    }
    // Show completed section
    if ($completedSection) {
      $completedSection.style.display = 'block';
    }
    // Populate form fields with workout data
    if (workout) {
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
      for (const element of formElements) {
        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement
        ) {
          const name = element.name;
          if (Object.hasOwn(mapping, name)) {
            element.value = mapping[name].toString();
          }
        }
      }
    }
    $title.textContent = workout?.title || 'Workout Details';
  } else if (mode === 'add') {
    // Make fields editable
    Array.from(formElements).forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.readOnly = false;
        element.value = '';
      }
    });
    // Hide completed section
    if ($completedSection) {
      $completedSection.style.display = 'none';
    }
    $dialog.setAttribute('data-entry', '0');
    formReset(); // Reset form for new entry
    $saveWorkout.style.display = 'block'; // Show save button
    $title.textContent = 'Add Workout'; // Set title for add mode
  }
};
// Validate all updated data
const validateWorkout = (workout) => {
  if (
    workout.duration.hrs < 0 ||
    workout.duration.mins < 0 ||
    workout.duration.secs < 0
  ) {
    console.error('Invalid duration values');
    return false;
  }
  if (workout.distance < 0) {
    console.error('Invalid distance value');
    return false;
  }
  return true;
};
// Is the workout completed?
const isWorkoutCompleted = (workout) => {
  return workout?.completion
    ? workout?.completion.hrs > 0 ||
        workout?.completion.mins > 0 ||
        workout?.completion.secs > 0 ||
        workout?.completion.distance > 0
    : false;
};
// Event Listeners
$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', ftpInput);
$saveWorkout.addEventListener('click', saveWorkout);
