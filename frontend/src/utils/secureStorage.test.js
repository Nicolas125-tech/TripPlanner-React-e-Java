import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { secureStorage } from './secureStorage';

describe('secureStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores data correctly in plain text and logs a warning', () => {
    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const rawStorage = sessionStorage.getItem('test_key');
    expect(rawStorage).toBeDefined();
    expect(rawStorage).toContain('Test User'); // Should be plain text now
    expect(console.warn).toHaveBeenCalledWith('SECURITY WARNING: secureStorage is storing data in plain text. Do not use for sensitive data.');
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
    sessionStorage.setItem('test_key', 'definitely_not_valid_json');

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('falls back to legacy base64 decoding if json parse fails but is base64 valid json', () => {
     // Simulate legacy base64 data
     const legacyData = { legacy: 'data' };
     sessionStorage.setItem('legacy_key', btoa(JSON.stringify(legacyData)));

     const retrievedData = secureStorage.getItem('legacy_key');
     expect(retrievedData).toEqual(legacyData);
     expect(console.error).toHaveBeenCalled();
  });
});
