import CryptoJS from 'crypto-js';

const getSecretKey = () => {
  // Vite sets import.meta.env
  return import.meta.env?.VITE_STORAGE_SECRET;
};

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      const secretKey = getSecretKey();

      if (!secretKey) {
        console.warn('VITE_STORAGE_SECRET is not defined. Storing data in plain text.');
        sessionStorage.setItem(key, stringValue);
        return;
      }

      const encryptedValue = CryptoJS.AES.encrypt(stringValue, secretKey).toString();
      sessionStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  getItem: (key) => {
    try {
      const storedValue = sessionStorage.getItem(key);
      if (!storedValue) return null;

      const secretKey = getSecretKey();

      if (secretKey) {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(storedValue, secretKey);
          const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

          if (decryptedString) {
            return JSON.parse(decryptedString);
          }
        } catch (e) {
          // Decryption failed, might be plain text or corrupted data
        }
      }

      // Fallback: try parsing as plain text
      return JSON.parse(storedValue);
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }
};
