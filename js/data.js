"use strict";
/* exported data */
;
/**
 * Calculate power zones based on the user's FTP (Functional Threshold Power)
 * @param ftp - The user's FTP value
 * @returns An array of ZoneRange objects representing power zones
 */
const calculateZones = (ftp) => {
    return [
        { min: 0, max: Math.round(ftp * 0.55) }, // Zone 1: Recovery (0-55% FTP)
        { min: Math.round(ftp * 0.55) + 1, max: Math.round(ftp * 0.75) }, // Zone 2: Endurance (56%-75%)
        { min: Math.round(ftp * 0.75) + 1, max: Math.round(ftp * 0.90) }, // Zone 3: Tempo (76%-90%)
        { min: Math.round(ftp * 0.90) + 1, max: Math.round(ftp * 1.05) }, // Zone 4: Threshold (91%-105%)
        { min: Math.round(ftp * 1.05) + 1, max: Math.round(ftp * 1.20) }, // Zone 5: VO2 Max (106%-120%)
        { min: Math.round(ftp * 1.20) + 1, max: Math.round(ftp * 1.50) }, // Zone 6: Anaerobic (121%-150%)
        { min: Math.round(ftp * 1.50) + 1, max: Infinity }, // Zone 7: Neuromuscular (151%+)
    ];
};
