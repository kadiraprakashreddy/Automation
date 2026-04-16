/**
 * @copyright 2026, FMR LLC
 * @file Unit tests for utils.validator.ts
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { isNullOrUndefinedOrEmpty, isValidDate } from './utils.validator';

describe('Utils Validator', () => {
  describe('isValidDate', () => {
    it('should return true for a valid date in a non-leap year', () => {
      expect(isValidDate(15, 5, 2023)).toBe(true); // June 15, 2023
    });

    it('should return true for February 28 in a non-leap year', () => {
      expect(isValidDate(28, 1, 2023)).toBe(true); // Feb 28, 2023
    });

    it('should return true for February 29 in a leap year', () => {
      expect(isValidDate(29, 1, 2024)).toBe(true); // Feb 29, 2024
    });

    it('should return true for December 31', () => {
      expect(isValidDate(31, 11, 2023)).toBe(true); // Dec 31, 2023
    });

    it('should return true for January 1', () => {
      expect(isValidDate(1, 0, 1900)).toBe(true); // Jan 1, 1900
    });

    it('should return false for year less than 1900', () => {
      expect(isValidDate(1, 0, 1899)).toBe(false);
    });

    it('should return false for year greater than 9999', () => {
      expect(isValidDate(1, 0, 10000)).toBe(false);
    });

    it('should return false for negative month', () => {
      expect(isValidDate(1, -1, 2023)).toBe(false);
    });

    it('should return false for month greater than 11', () => {
      expect(isValidDate(1, 12, 2023)).toBe(false);
    });

    it('should return false for invalid day (0)', () => {
      expect(isValidDate(0, 0, 2023)).toBe(false);
    });

    it('should return false for invalid day (negative)', () => {
      expect(isValidDate(-1, 0, 2023)).toBe(false);
    });

    it('should return false for day greater than month length', () => {
      expect(isValidDate(32, 0, 2023)).toBe(false); // Jan has 31 days
    });

    it('should return false for February 29 in a non-leap year', () => {
      expect(isValidDate(29, 1, 2023)).toBe(false);
    });

    it('should return false for February 30', () => {
      expect(isValidDate(30, 1, 2024)).toBe(false);
    });

    it('should return false for NaN year', () => {
      expect(isValidDate(1, 0, NaN)).toBe(false);
    });

    it('should return true for leap year divisible by 400', () => {
      expect(isValidDate(29, 1, 2000)).toBe(true); // 2000 is leap year
    });

    it('should return false for year divisible by 100 but not 400 (2100)', () => {
      expect(isValidDate(29, 1, 2100)).toBe(false); // 2100 is not leap year
    });

    it('should return true for day equal to month length (31 in January)', () => {
      expect(isValidDate(31, 0, 2023)).toBe(true); // Jan 31, 2023
    });

    it('should return false for day greater than month length (32 in January)', () => {
      expect(isValidDate(32, 0, 2023)).toBe(false); // Jan has 31 days
    });
  });

  describe('isNullOrUndefinedOrEmpty', () => {
    it('should return true for null', () => {
      expect(isNullOrUndefinedOrEmpty(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNullOrUndefinedOrEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isNullOrUndefinedOrEmpty('')).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isNullOrUndefinedOrEmpty({})).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(isNullOrUndefinedOrEmpty('test')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isNullOrUndefinedOrEmpty(0)).toBe(false);
    });

    it('should return false for boolean', () => {
      expect(isNullOrUndefinedOrEmpty(true)).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(isNullOrUndefinedOrEmpty([])).toBe(false);
    });

    it('should return false for non-empty object', () => {
      expect(isNullOrUndefinedOrEmpty({ key: 'value' })).toBe(false);
    });

    it('should return false for non-empty array', () => {
      expect(isNullOrUndefinedOrEmpty([1, 2, 3])).toBe(false);
    });
  });
});
