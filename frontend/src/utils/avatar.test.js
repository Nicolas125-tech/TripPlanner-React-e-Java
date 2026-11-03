import { describe, it, expect } from 'vitest';
import { generateAvatar } from './avatar';

describe('generateAvatar', () => {
  it('generates an avatar URL with the first letter of the name', () => {
    const avatar = generateAvatar('John');
    expect(avatar).toContain('data:image/svg+xml;utf8,');

    // URL decode to check content
    const urlContent = avatar.split('utf8,')[1];
    const decodedSvg = decodeURIComponent(urlContent);
    expect(decodedSvg).toContain('>J<');
  });

  it('uses "Visitante" as default when name is not provided', () => {
    const avatar = generateAvatar();
    const urlContent = avatar.split('utf8,')[1];
    const decodedSvg = decodeURIComponent(urlContent);
    expect(decodedSvg).toContain('>V<');
  });

  it('handles emoji characters gracefully', () => {
    const avatar = generateAvatar('🚀 John');
    const urlContent = avatar.split('utf8,')[1];
    const decodedSvg = decodeURIComponent(urlContent);
    expect(decodedSvg).toContain('>🚀<');
  });
});
