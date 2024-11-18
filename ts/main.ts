const $ftpInput = document.querySelector('.ftp') as HTMLInputElement;
const $zoneElements = document.querySelectorAll(
  '.zone',
) as NodeListOf<HTMLElement>;
const $openModal = document.querySelector('.open-today-modal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('.modal') as HTMLDialogElement;
const $saveWorkout = document.querySelector('#save-workout') as HTMLElement;
const $form = document.querySelector('#entry-form') as HTMLFormElement;
const $title = document.querySelector('.modal__title');

if (!$saveWorkout) throw new Error('$saveWorkout elements did not query!');
if (!$form) throw new Error('$form did not query!');
if (!$title) throw new Error('$title did not query!');
if (!$openModal) throw new Error('$openModal did not query!');

const loadWorkouts = (): void => {
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
    entries.forEach((workout: Workouts) => {
      const $workout = document.createElement('li');
      $workout.classList.add('workout-entry');
      $workout.textContent = `${workout.title}`;
      $newEntriesContainer.appendChild($workout);

      $workout.addEventListener('click', () => showWorkoutInModal(workout));
    });
  } catch (err) {
    console.log('Failed to load data!:', err);
  }
};

const showWorkoutInModal = (workout: Workouts): void => {
  viewSwap('view', workout); // Switch to view mode with data
  $dialog?.showModal(); // Open modal
};

document.addEventListener('DOMContentLoaded', loadWorkouts);

const saveWorkout = (e: Event): void => {
  e.preventDefault();

  const data = new FormData($form);

  const newWorkout: Workouts = {
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

const openModal = (): void => {
  viewSwap('add'); // Switch to add mode
  $dialog?.showModal(); // Open modal
};

const closeModal = (): void => {
  $dialog?.close();
};

const ftpInput = (): void => {
  const ftp = Number($ftpInput.value);
  if (!isNaN(ftp) && ftp > 0) {
    const zones: ZoneRange[] = calculateZones(ftp);
    $zoneElements.forEach((zone, index) => {
      const { min, max } = zones[index];
      zone.textContent = `Zone ${index + 1}: ${min} - ${max}`;
    });
  } else {
    console.error(
      'Invalid FTP input. Please enter a number greater than zero.',
    );
  }
};

const formReset = (): void => {
  $form.reset();
};

// viewSwap
const viewSwap = (mode: 'view' | 'add', workout?: Workouts): void => {
  const formElements = $form.elements;
  const $completedSection = document.querySelector(
    '.modal__group.completed',
  ) as HTMLElement;

  if (mode === 'view') {
    // Set fields to readonly and populate data
    Array.from(formElements).forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.readOnly = true;
      }
    });

    // Show completed section
    if ($completedSection) {
      $completedSection.style.display = 'block';
    }

    // Populate form fields with workout data
    if (workout) {
      const mapping: { [key: string]: any } = {
        title: workout.title,
        hours: workout.duration.hrs,
        minutes: workout.duration.mins,
        seconds: workout.duration.secs,
        distance: workout.distance,
        ftp: workout.ftp,
        comment: workout.comment,
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

    // Hide save button
    $saveWorkout.style.display = 'none';
  } else if (mode === 'add') {
    // Make fields editable
    Array.from(formElements).forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.readOnly = false;
      }
    });

    // Hide completed section
    if ($completedSection) {
      $completedSection.style.display = 'none';
    }

    // Reset form for new entry
    formReset();

    // Show save button
    $saveWorkout.style.display = 'block';

    // Set title for add mode
    $title.textContent = 'Add Workout';
  }
};

// Event Listeners
$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', ftpInput);
$saveWorkout.addEventListener('click', saveWorkout);
