/**
 * @copyright 2026, FMR LLC
 * @file This file contains custom date validator
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Returns a ValidatorFn that validates a Date value directly.
 *
 * The validator expects the bound control to hold a Date value. Validation is
 * performed only when the control is dirty. The validator checks if the date value is a valid Date object
 * and returns a ValidationErrors object { invalidDate: true } when the date is invalid;
 * otherwise it returns null.
 *
 * @returns {ValidatorFn} A validator function that produces ValidationErrors | null.
 */
export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.dirty) {
      const dateValue = control.value;
      // Check if the value is a valid Date object
      if (
        !dateValue ||
        !(dateValue instanceof Date) ||
        isNaN(dateValue.getTime())
      ) {
        return { invalidDate: true };
      }
    }
    return null;
  };
}

/**
 * Creates a ValidatorFn that compares a Date value against a given reference date.
 *
 * The validator expects the control to hold a Date value directly. It will:
 * - only perform validation when the supplied control is dirty,
 * - return a ValidationErrors object { lessThanHireDate: true } when the date is before the provided beforeDate,
 * - return null when the date is the same or after beforeDate (i.e. valid).
 *
 * @param beforeDate - The reference Date to compare against. If beforeDate > controlDate the validator flags an error.
 * @returns A ValidatorFn that returns ValidationErrors or null.
 */
export function dateComparisonValidator(beforeDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.dirty) {
      const currentDate = control.value;

      // Validate that the date is not before the reference date
      if (
        currentDate &&
        currentDate instanceof Date &&
        beforeDate > currentDate
      ) {
        return { lessThanHireDate: true };
      }
    }
    return null;
  };
}
