const $ftpInput = document.querySelector('.ftp-input') as HTMLInputElement;
const $zoneElements = document.querySelectorAll('.zone') as NodeListOf<HTMLElement>;
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');

// Date
const $modalTitleDate = document.querySelector('.modal-title');
if (!$modalTitleDate) throw new Error('$modalTitleDate did not query!');

const formatDate = () => {
  const today = new Date();
  return today.toDateString();  // Set current date
}

// Modal
$openModal?.addEventListener('click', () => {
  $modalTitleDate.textContent = formatDate();
  $dialog?.showModal();
});

$dismissModal?.addEventListener('click', () => {
  $dialog?.close();
});

// FTP Calculation with arrow function
$ftpInput.addEventListener('input', () => {
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
      throw new Error('Invalid Input. Please enter a valid number greater than zero.');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
});
