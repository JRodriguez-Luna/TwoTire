const $ftpInput = document.querySelector('.ftp-input') as HTMLInputElement;
const $zoneElements = document.querySelectorAll('.zone') as NodeListOf<HTMLElement>;
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('.modal') as HTMLDialogElement;
const $saveWorkout = document.querySelector('#save-workout');
const $form = document.querySelector('#entry-form') as HTMLFormElement;
const $modalTitleDate = document.querySelector('.modal__title');

if (!$saveWorkout) throw new Error('$saveWorkout elements did not query!');
if (!$form) throw new Error('$form did not query!');
if (!$modalTitleDate) throw new Error('$modalTitleDate did not query!')
if (!$openModal) throw new Error('$openModal did not query!');

const loadWorkouts = async (): Promise<void> => {
try {
  const $newEntriesContainer = document.querySelector('.workout-section__entries');
  if (!$newEntriesContainer) {
    console.error('$newEntriesContainer did not query!');
    return;
  }
    const workouts = await getWorkouts();
    workouts.forEach(workout => {
      const $workout = document.createElement('div');
      $workout.classList.add('workout-entry');
      $workout.textContent = workout.title;
      $newEntriesContainer.appendChild($workout);
    });
  } catch (err) {
    console.log('Failed to load data!:', err);
  }
};

document.addEventListener('DOMContentLoaded', loadWorkouts);

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
  };

  addWorkout(newWorkout);
  loadWorkouts();
  formReset();
  $dialog?.close();
  console.log('Workout saved:', newWorkout);
};

const formatDate = (): string => {
  const today = new Date();
  return today.toDateString();
};

const openModal = () => {
  $modalTitleDate.textContent = formatDate();
  $dialog?.showModal();
};

const closeModal = () => {
  $dialog?.close();
};

const ftpInput = () => {
  const ftp = Number($ftpInput.value);
  if (!isNaN(ftp) && ftp > 0) {
    const zones: ZoneRange[] = calculateZones(ftp);
    $zoneElements.forEach((zone, index) => {
      const { min, max } = zones[index];
      zone.textContent = `Zone ${index + 1}: ${min} - ${max}`;
    });
  } else {
    console.error('Invalid FTP input. Please enter a number greater than zero.');
  }
};

const formReset = () => {
  $form.reset();
};

$openModal?.addEventListener('click', openModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', ftpInput);
$saveWorkout.addEventListener('click', saveWorkout);
