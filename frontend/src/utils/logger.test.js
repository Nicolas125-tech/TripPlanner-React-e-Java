import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call console.info', () => {
    logger.info('test info');
    expect(console.info).toHaveBeenCalledWith('test info');
  });

  it('should call console.warn', () => {
    logger.warn('test warn');
    expect(console.warn).toHaveBeenCalledWith('test warn');
  });

  it('should call console.error', () => {
    logger.error('test error');
    expect(console.error).toHaveBeenCalledWith('test error');
  });

  it('should call console.debug', () => {
    logger.debug('test debug');
    expect(console.debug).toHaveBeenCalledWith('test debug');
  });
});
