import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { secureStorage } from './secureStorage';

describe('secureStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores data as JSON string in sessionStorage', () => {
    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const rawStorage = sessionStorage.getItem('test_key');
    expect(rawStorage).toBeDefined();

    // Should be able to parse as plain JSON
    expect(JSON.parse(rawStorage)).toEqual(testData);
  });

  it('retrieves and parses JSON data correctly', () => {
    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toEqual(testData);
  });

  it('returns null for non-existent keys', () => {
    const retrievedData = secureStorage.getItem('non_existent_key');
    expect(retrievedData).toBeNull();
  });

  it('logs an error when setItem fails', () => {
    const error = new Error('Storage quota exceeded');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw error;
    });

    secureStorage.setItem('test_key', 'some data');
    expect(console.error).toHaveBeenCalledWith('Error saving data:', error);
  });

  it('logs an error and returns null when getItem throws an exception (e.g. invalid JSON)', () => {
    // Returning invalid JSON to force JSON.parse to throw a SyntaxError
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('{invalid json');

    const retrievedData = secureStorage.getItem('test_key');

    expect(retrievedData).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error retrieving data:', expect.any(SyntaxError));
  });
});
