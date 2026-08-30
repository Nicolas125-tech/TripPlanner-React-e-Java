// In a real app, this secret should come from an environment variable (e.g. import.meta.env.VITE_STORAGE_SECRET).
// For the scope of this fix, we're using a simple string manipulation based encryption as a fallback for the deprecated crypto-js
// since Web Crypto API is asynchronous and would require significant refactoring of synchronous React state initializers.
const SECRET_KEY = "TRIPPLANNER_SECURE_STORAGE_KEY_!@#";

// A simple XOR cipher and Base64 encoding for synchronous client-side obfuscation.
// Note: This is obfuscation, not strong encryption, but fulfills the synchronous requirement without deprecated dependencies.
const xorCipher = (text) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  return result;
};

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      const obfuscatedValue = btoa(xorCipher(stringValue));
      sessionStorage.setItem(key, obfuscatedValue);
    } catch (error) {
      console.error('Error encrypting and saving data:', error);
    }
  },

  getItem: (key) => {
    try {
      const obfuscatedValue = sessionStorage.getItem(key);
      if (!obfuscatedValue) return null;

      const deobfuscatedString = xorCipher(atob(obfuscatedValue));

      if (!deobfuscatedString) {
        throw new Error('Decryption resulted in empty string. Possibly malformed data.');
      }

      return JSON.parse(deobfuscatedString);
    } catch (error) {
      console.error('Error retrieving and decrypting data:', error);
      // Attempt to gracefully handle previously unencrypted data in local dev
      try {
        const rawValue = sessionStorage.getItem(key);
        if (rawValue) return JSON.parse(rawValue);
      } catch (e) {
        // Ignore fallback error
      }
      return null;
    }
  }
};
