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
      const storedValue = sessionStorage.getItem(key);
      if (!storedValue) return null;

      return JSON.parse(storedValue);
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }
};
