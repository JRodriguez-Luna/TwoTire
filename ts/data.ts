/* exported data */
interface ZoneRange {
  min: number | string,
  max: number | string,
};

const calculateZones = (ftp: number): ZoneRange[] => {
  return [
    { min: 0, max: Math.round(ftp * 0.55) },  // Zone 1: 0 - 55% FTP
    { min: Math.round(ftp * 0.55) + 1, max: Math.round(ftp * 0.75) }, // Zone 2: 56% - 75% FTP
    { min: Math.round(ftp * 0.75) + 1, max: Math.round(ftp * 0.90) }, // Zone 3: 76% - 90% FTP
    { min: Math.round(ftp * 0.90) + 1, max: Math.round(ftp * 1.05) }, // Zone 4: 91 - 105%% FTP
    { min: Math.round(ftp * 1.05) + 1, max: Math.round(ftp * 1.20) }, // Zone 5: 106% - 120%% FTP
    { min: Math.round(ftp * 1.20) + 1, max: Math.round(ftp * 1.50) }, // Zone 6: 121% - 150% FTP
    { min: Math.round(ftp * 1.50) + 1, max: Infinity }, // Zone 7: 151%+ FTP
  ]
}
