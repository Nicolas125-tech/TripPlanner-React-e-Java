import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { secureStorage } from './secureStorage';
import CryptoJS from 'crypto-js';

const TEST_SECRET = 'test_secret_123';

describe('secureStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('stores data encrypted when VITE_STORAGE_SECRET is defined', () => {
    vi.stubEnv('VITE_STORAGE_SECRET', TEST_SECRET);

    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const rawStorage = sessionStorage.getItem('test_key');
    expect(rawStorage).toBeDefined();

    // It should not be plain text
    expect(() => JSON.parse(rawStorage)).toThrow();

    // Decrypting manually should yield the original data
    const decryptedBytes = CryptoJS.AES.decrypt(rawStorage, TEST_SECRET);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    expect(JSON.parse(decryptedString)).toEqual(testData);
  });

  it('stores data in plain text when VITE_STORAGE_SECRET is missing', () => {
    vi.stubEnv('VITE_STORAGE_SECRET', undefined);

    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const rawStorage = sessionStorage.getItem('test_key');
    expect(rawStorage).toBeDefined();

    // Should be able to parse as plain JSON
    expect(JSON.parse(rawStorage)).toEqual(testData);
    expect(console.warn).toHaveBeenCalledWith('VITE_STORAGE_SECRET is not defined. Storing data in plain text.');
  });

  it('retrieves and decrypts encrypted data correctly', () => {
    vi.stubEnv('VITE_STORAGE_SECRET', TEST_SECRET);

    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toEqual(testData);
  });

  it('retrieves plain text data correctly when secret is missing', () => {
    vi.stubEnv('VITE_STORAGE_SECRET', undefined);

    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toEqual(testData);
  });

  it('retrieves plain text data correctly even if secret is set (backwards compatibility)', () => {
    // Simulate legacy plain text data existing in storage
    const testData = { id: 1, name: 'Test User' };
    sessionStorage.setItem('legacy_key', JSON.stringify(testData));

    // Set environment variable
    vi.stubEnv('VITE_STORAGE_SECRET', TEST_SECRET);

    // It should try decrypting, fail, and fallback to plain JSON parse
    const retrievedData = secureStorage.getItem('legacy_key');
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
    // Error could be thrown either by crypto-js decryption or JSON.parse
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

  it('logs an error and returns null when getItem throws an exception', () => {
    vi.stubEnv('VITE_STORAGE_SECRET', undefined);
    // Returning invalid JSON to force JSON.parse to throw a SyntaxError
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('{invalid json');

    const retrievedData = secureStorage.getItem('test_key');

    expect(retrievedData).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error retrieving data:', expect.any(SyntaxError));
  });
});
