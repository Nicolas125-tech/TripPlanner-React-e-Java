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

  it('obfuscates and stores data correctly', () => {
    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const rawStorage = sessionStorage.getItem('test_key');
    expect(rawStorage).toBeDefined();
    expect(rawStorage).not.toContain('Test User'); // Should be obfuscated
  });

  it('retrieves and deobfuscates data correctly', () => {
    const testData = { id: 1, name: 'Test User' };
    secureStorage.setItem('test_key', testData);

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toEqual(testData);
  });

  it('returns null for non-existent keys', () => {
    const retrievedData = secureStorage.getItem('non_existent_key');
    expect(retrievedData).toBeNull();
  });

  it('handles corrupted encrypted data gracefully', () => {
    sessionStorage.setItem('test_key', 'definitely_not_valid_encrypted_string');

    const retrievedData = secureStorage.getItem('test_key');
    expect(retrievedData).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('falls back to raw JSON parsing if decryption fails but data is valid JSON', () => {
     // Simulate pre-existing unencrypted data
     const rawData = { legacy: 'data' };
     sessionStorage.setItem('legacy_key', JSON.stringify(rawData));

     const retrievedData = secureStorage.getItem('legacy_key');
     expect(retrievedData).toEqual(rawData);
     expect(console.error).toHaveBeenCalled();
  });
});
