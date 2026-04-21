/**
 * @copyright 2026, FMR LLC
 * @file This file contains common validation methods.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * Validates whether the provided day, month, and year form a valid date.
 *
 * This function checks if the date is within the range of years 1900 to 9999,
 * ensures the month is between 0 (January) and 11 (December), and verifies
 * that the day is valid for the given month, accounting for leap years.
 *
 * @param day - The day of the month (1-based).
 * @param month - The month of the year (0-based, where 0 is January).
 * @param year - The year (must be between 1900 and 9999).
 * @returns True if the date is valid, false otherwise.
 */
export function isValidDate(day: number, month: number, year: number): boolean {
  // Length of months (will update for leap years)
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Make sure date is in range
  if (
    year < 1900 ||
    year > 9999 ||
    month < 0 ||
    month > 11 ||
    Number.isNaN(year)
  ) {
    return false;
  }
  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }
  // Check the range of the day
  if (!(day > 0 && day <= monthLength[month])) {
    return false;
  }
  return true;
}

/**
 * Checks if the given object is null, undefined, an empty string, or an empty object.
 * @param object - The object to check.
 * @returns True if the object is null, undefined, empty string, or empty object; otherwise, false.
 */
export function isNullOrUndefinedOrEmpty(object: unknown): boolean {
  return (
    object === null ||
    object === undefined ||
    (typeof object === 'string' && object === '') ||
    (typeof object === 'object' &&
      object !== null &&
      !Array.isArray(object) &&
      Object.keys(object).length === 0)
  );
}
