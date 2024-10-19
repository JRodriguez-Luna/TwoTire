const $ftpInput = document.querySelector('.ftp-input') as HTMLInputElement;
const $zoneElements = document.querySelectorAll(
  '.zone',
) as NodeListOf<HTMLElement>;
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');
// workout elements
const $saveWorkout = document.querySelector('#save-workout');
const $title = document.querySelector('#title-entry') as HTMLInputElement;
const $hours = document.querySelector('#hours') as HTMLInputElement;
const $mins = document.querySelector('#minutes') as HTMLInputElement;
const $secs = document.querySelector('#seconds') as HTMLInputElement;
const $distance = document.querySelector('#distance') as HTMLInputElement;
const $avgSpeed = document.querySelector('#avg-speed') as HTMLInputElement;
const $avgCadence = document.querySelector('#avg-cadence') as HTMLInputElement;
const $avgHR = document.querySelector('#avg-HR') as HTMLInputElement;
const $elevGain = document.querySelector('#elevation-gain') as HTMLInputElement;
const $comment = document.querySelector('#comment') as HTMLTextAreaElement;

// Check if valid
if (!$saveWorkout) throw new Error('$saveWorkout did not query!');
if (!$title) throw new Error('$title did not query!');
if (!$hours) throw new Error('$hours did not query!');
if (!$mins) throw new Error('$mins did not query!');
if (!$secs) throw new Error('$secs did not query!');
if (!$distance) throw new Error('$distance did not query!');
if (!$avgSpeed) throw new Error('$avgSpeed did not query!');
if (!$avgCadence) throw new Error('$avgCadence did not query!');
if (!$avgHR) throw new Error('$avgHR did not query!');
if (!$elevGain) throw new Error('$elevGain did not query!');
if (!$comment) throw new Error('$comment did not query!');

// Save Workout
const saveWorkout = () => {
  const newWorkout: Workout = {
    date: formatDate(),
    title: $title.value,
    duration: {
      hrs: Number($hours.value) || 0,
      mins: Number($mins) || 0,
      secs: Number($secs) || 0
    },
    distance: Number($distance.value) || 0,
    avgSpeed: Number($avgSpeed.value) || 0,
    avgCadence: Number($avgCadence.value) || 0,
    avgHR: Number($avgHR.value) || 0,
    elevGain: Number($elevGain.value) || 0,
    ftp: Number($ftpInput.value) || 220,
    comment: $comment.value || '',
  }

  addWorkout(newWorkout);
  formReset();
  $dialog?.close();

  // Check to see if workout saved
  console.log('Workout saved:', newWorkout);
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
  $title.value = '';
  $hours.value = '';
  $mins.value = '';
  $secs.value = '';
  $distance.value = '';
  $avgSpeed.value = '';
  $avgCadence.value = '';
  $avgHR.value = '';
  $elevGain.value = '';
}

$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', ftpInput);
$saveWorkout.addEventListener('click', saveWorkout);
