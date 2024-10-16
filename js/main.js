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
const initializeMap = () => {
    const map = L.map('map').setView([34.0522, -118.2437], 13); // Default view for Los Angeles
    // Add the CyclOSM tile layer
    L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CyclOSM'
    }).addTo(map);
};
// Call the function to initialize the map when the modal is opened
$openModal?.addEventListener('click', () => {
    $modalTitleDate.textContent = formatDate();
    $dialog?.showModal();
    initializeMap(); // Initialize map here when the modal is opened
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
