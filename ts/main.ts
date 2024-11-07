const $ftpInput = document.querySelector('.ftp-input') as HTMLInputElement;
const $zoneElements = document.querySelectorAll(
  '.zone',
) as NodeListOf<HTMLElement>;
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');
// workout elements
const $saveWorkout = document.querySelector('#save-workout');
const $form = document.querySelector('#entry-form') as HTMLFormElement;

// Check if valid
if (!$saveWorkout) throw new Error('$saveWorkout did not query!');
if (!$form) throw new Error('$form did not query!');

document.addEventListener('DOMContentLoaded', () => {
  loadWorkouts();
});

// Save Workout
const saveWorkout = (e: Event) => {
  e.preventDefault();

  const data = new FormData($form);

  const newWorkout: Workout = {
    date: formatDate(),
    title: String(data.get('title')),
    duration: {
      hrs: Number(data.get('hours')) || 0,
      mins: Number(data.get('minutes')) || 0,
      secs: Number(data.get('seconds')) || 0,
    },
    distance: Number(data.get('distance')) || 0,
    ftp: Number(data.get('ftp-input')) || 220,
    comment: String(data.get('comment')) || '',
  }

  addWorkout(newWorkout);
  loadWorkouts();
  formReset();
  $dialog?.close();

  // Check to see if workout saved
  console.log('Workout saved:', newWorkout);
}

// loadWorkout
const loadWorkouts = (): void => {
  const $newEntriesContainer = document.querySelector('.new-entries-container');
  const $newEntry = getWorkouts();

  $newEntry.forEach((workout) => {
    const $workout = document.createElement('div');
    $workout.classList.add('workout-entry');
    $workout.textContent = `${workout.title}`;
    $newEntriesContainer?.appendChild($workout);
  });
}


// Date
const $modalTitleDate = document.querySelector('.modal-title');
if (!$modalTitleDate) throw new Error('$modalTitleDate did not query!');

const formatDate = () => {
  const today = new Date();
  return today.toDateString(); // Set current date
};

// Modal

// Call the function to initialize the map when the modal is opened
const openModal = () => {
  $modalTitleDate.textContent = formatDate();
  $dialog?.showModal();
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
      const zones: ZoneRange[] = calculateZones(ftp); // min, max values

      // Update the DOM elements with new zone values
      $zoneElements.forEach((zone, index) => {
        const { min, max } = zones[index];
        zone.textContent = `Zone ${index + 1}: ${min} - ${max}`;
      });
    } else {
      throw new Error(
        'Invalid Input. Please enter a valid number greater than zero.',
      );
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

const formReset = () => {
  $form.reset();
}

$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', ftpInput);
$saveWorkout.addEventListener('click', saveWorkout);
