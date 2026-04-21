/**
 * @copyright 2026, FMR LLC
 * @file Test file for utility service
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  let spectator: SpectatorService<UtilityService>;
  const createService = createServiceFactory(UtilityService);

  beforeEach(() => (spectator = createService()));

  describe('isStringNotEmpty', () => {
    it('should return false when item is null', () => {
      const result = spectator.service.isStringNotEmpty(null);
      expect(result).toBe(false);
    });

    it('should return false when item is undefined', () => {
      const result = spectator.service.isStringNotEmpty(undefined);
      expect(result).toBe(false);
    });

    it('should return false when item is an empty string', () => {
      const result = spectator.service.isStringNotEmpty('');
      expect(result).toBe(false);
    });

    it('should return false when item is a whitespace-only string', () => {
      const result = spectator.service.isStringNotEmpty('   ');
      expect(result).toBe(false);
    });

    it('should return true when item is a non-empty string', () => {
      const result = spectator.service.isStringNotEmpty('hello');
      expect(result).toBe(true);
    });
  });

  describe('isNullOrUndefined', () => {
    it('should return true when item is null', () => {
      const result = spectator.service.isNullOrUndefined(null);
      expect(result).toBe(true);
    });

    it('should return true when item is undefined', () => {
      const result = spectator.service.isNullOrUndefined(undefined);
      expect(result).toBe(true);
    });

    it('should return false when item is a string', () => {
      const result = spectator.service.isNullOrUndefined('test');
      expect(result).toBe(false);
    });

    it('should return false when item is a number', () => {
      const result = spectator.service.isNullOrUndefined(42);
      expect(result).toBe(false);
    });

    it('should return false when item is an object', () => {
      const result = spectator.service.isNullOrUndefined({});
      expect(result).toBe(false);
    });
  });
});
