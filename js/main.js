"use strict";
const $ftpInput = document.querySelector('.ftp-input');
const $zoneElements = document.querySelectorAll('.zone');
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');
// Date
const $modalTitleDate = document.querySelector('.modal-title');
if (!$modalTitleDate)
    throw new Error('$modalTitleDate did not query!');
const formatDate = () => {
    const today = new Date();
    return today.toDateString(); // Set current date
};
// Modal
const showModal = () => {
    $modalTitleDate.textContent = formatDate();
    $dialog?.showModal();
};
const closeModal = () => {
    $dialog?.close();
};
// ** FTP Calculation with arrow function **
// Update the zones based on FTP value
const updateZones = (zones) => {
    $zoneElements.forEach((zone, index) => {
        const { min, max } = zones[index];
        zone.textContent = `Zone ${index + 1}: ${min} - ${max}`;
    });
};
// Handle FTP input and calculate zones
const handleFTPInput = () => {
    const ftp = Number($ftpInput.value);
    if (!isNaN(ftp) && ftp > 0) {
        const zones = calculateZones(ftp);
        updateZones(zones);
    }
    else {
        console.error('Invalid Input. Please enter a valid number greater than zero.');
    }
};
$openModal?.addEventListener('click', showModal);
$dismissModal?.addEventListener('click', closeModal);
$ftpInput.addEventListener('input', handleFTPInput);
