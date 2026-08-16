import { describe, it, expect } from 'vitest';
import { mockDestinations } from './fallbackData';

describe('mockDestinations', () => {
  it('should be an array', () => {
    expect(Array.isArray(mockDestinations)).toBe(true);
  });

  it('should not be empty', () => {
    expect(mockDestinations.length).toBeGreaterThan(0);
  });

  it('should have the correct structure for each destination', () => {
    mockDestinations.forEach(destination => {
      expect(destination).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          city: expect.any(String),
          country: expect.any(String),
          price: expect.any(Number),
          rating: expect.any(Number),
          category: expect.any(String),
          image: expect.any(String),
          description: expect.any(String),
          amenities: expect.any(Array),
          reviews: expect.any(Number)
        })
      );

      // Ensure amenities is an array of strings
      destination.amenities.forEach(amenity => {
        expect(typeof amenity).toBe('string');
      });
    });
  });

  it('should have unique ids for all destinations', () => {
    const ids = mockDestinations.map(d => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
