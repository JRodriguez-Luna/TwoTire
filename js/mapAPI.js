"use strict";
const initializeMap = () => {
    const map = L.map('map').setView([34.0522, -118.2437], 13); // Default view for Los Angeles
    // Add the CyclOSM tile layer
    L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CyclOSM',
    }).addTo(map);
    // Map Routing
    L.Routing.control({
        waypoints: [L.latLng(34.0522, -118.2437), L.latLng(34.0622, -118.2537)],
        routeWhileDragging: true,
        router: L.Routing.osrmv1({
            serviceURL: 'https://router.project-osrm.org/route/v1/bike/',
        }),
        lineOptions: {
            style: [{ color: 'red', weight: 4 }],
        },
    }).addTo(map);
};
