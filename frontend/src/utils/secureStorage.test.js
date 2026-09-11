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

  it('stores data correctly in plain text', () => {
    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const rawStorage = sessionStorage.getItem('test_key');
    expect(rawStorage).toBeDefined();
    expect(JSON.parse(rawStorage)).toEqual(testData);
  });

  it('retrieves data correctly', () => {
    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toEqual(testData);
  });

  it('returns null for non-existent keys', () => {
    const retrievedData = secureStorage.getItem('non_existent_key');
    expect(retrievedData).toBeNull();
  });

  it('handles corrupted data gracefully', () => {
    sessionStorage.setItem('test_key', 'definitely_not_valid_json_string');

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('logs an error when setItem fails', () => {
    const error = new Error('Storage quota exceeded');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw error;
    });

    secureStorage.setItem('test_key', 'some data');
    expect(console.error).toHaveBeenCalledWith('Error saving data:', error);
  });
});
