export const secureStorage = {
  setItem: (key, value) => {
    try {
      console.warn('SECURITY WARNING: secureStorage is storing data in plain text. Do not use for sensitive data.');
      const stringValue = JSON.stringify(value);
      sessionStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  getItem: (key) => {
    try {
      const rawValue = sessionStorage.getItem(key);
      if (!rawValue) return null;

      return JSON.parse(rawValue);
    } catch (error) {
      console.error('Error retrieving data:', error);
      // Attempt to gracefully handle previously base64 encoded data from the old implementation
      try {
        const legacyValue = sessionStorage.getItem(key);
        if (legacyValue) {
           try {
             return JSON.parse(atob(legacyValue));
           } catch {
             // Not base64, ignore
           }
        }
      } catch (e) {
        // Ignore fallback error
      }
      return null;
    }
  }
};
