"use strict";
const $ftpInput = document.querySelector('.ftp-input');
const $zoneElements = document.querySelectorAll('.zone');
const $openModal = document.querySelector('.openTodayModal');
const $dismissModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');
// Modal
$openModal?.addEventListener('click', () => {
    console.log('Button clicked!');
    $dialog?.showModal();
});
$dismissModal?.addEventListener('click', () => {
    console.log('Dialog dismissed!');
    $dialog?.close();
});
// FTP Calculation with arrow function
$ftpInput.addEventListener('input', () => {
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
});
