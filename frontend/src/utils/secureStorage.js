// ⚠️ SECURITY WARNING ⚠️
// This storage module stores data in plain text in the browser's sessionStorage.
// It is explicitly named `secureStorage` to maintain API compatibility with legacy code,
// but it DOES NOT encrypt or securely obfuscate data.
// DO NOT use this to store sensitive information (e.g., passwords, PII, payment details).
// Previous iterations used weak XOR obfuscation which provided a false sense of security.

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      sessionStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  getItem: (key) => {
    try {
      const stringValue = sessionStorage.getItem(key);
      if (!stringValue) return null;

      return JSON.parse(stringValue);
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }
};
