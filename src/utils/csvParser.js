// src/utils/csvParser.js
import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const validPrizes = results.data.flat().filter((prize) => prize && prize.trim() !== '');
        resolve(validPrizes);
      },
      error: reject,
    });
  });
};
