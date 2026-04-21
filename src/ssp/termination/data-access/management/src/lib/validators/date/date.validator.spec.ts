/**
 * @copyright 2026, FMR LLC
 * @file This file contains custom date validator
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { dateComparisonValidator, dateValidator } from './date.validator';

describe('Date Validators', () => {
  const fb = new UntypedFormBuilder();

  describe('dateValidator', () => {
    it('should return null when control is pristine', () => {
      const control: UntypedFormControl = fb.control(null, {
        validators: [dateValidator()],
      });
      expect(control.errors).toBeNull();
    });

    it('should return null for a valid Date when control is dirty', () => {
      const control: UntypedFormControl = fb.control(new Date(2024, 0, 15), {
        validators: [dateValidator()],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();
    });

    it('should return { invalidDate: true } when value is null and control is dirty', () => {
      const control: UntypedFormControl = fb.control(null, {
        validators: [dateValidator()],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toEqual({ invalidDate: true });
    });

    it('should return { invalidDate: true } when value is a non-Date string and control is dirty', () => {
      const control: UntypedFormControl = fb.control('2024-01-15', {
        validators: [dateValidator()],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toEqual({ invalidDate: true });
    });

    it('should return { invalidDate: true } when value is an invalid Date and control is dirty', () => {
      const control: UntypedFormControl = fb.control(new Date('invalid'), {
        validators: [dateValidator()],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toEqual({ invalidDate: true });
    });
  });

  describe('dateComparisonValidator', () => {
    const hireDate = new Date(2020, 0, 1); // Jan 1, 2020

    it('should return null when control is pristine', () => {
      const control: UntypedFormControl = fb.control(new Date(2019, 0, 1), {
        validators: [dateComparisonValidator(hireDate)],
      });
      expect(control.errors).toBeNull();
    });

    it('should return { lessThanHireDate: true } when date is before hire date and dirty', () => {
      const control: UntypedFormControl = fb.control(new Date(2019, 11, 31), {
        validators: [dateComparisonValidator(hireDate)],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toEqual({ lessThanHireDate: true });
    });

    it('should return null when date equals hire date and dirty', () => {
      const control: UntypedFormControl = fb.control(new Date(2020, 0, 1), {
        validators: [dateComparisonValidator(hireDate)],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();
    });

    it('should return null when date is after hire date and dirty', () => {
      const control: UntypedFormControl = fb.control(new Date(2020, 6, 1), {
        validators: [dateComparisonValidator(hireDate)],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();
    });

    it('should return null when value is null and dirty', () => {
      const control: UntypedFormControl = fb.control(null, {
        validators: [dateComparisonValidator(hireDate)],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();
    });

    it('should return null when value is a non-Date value and dirty', () => {
      const control: UntypedFormControl = fb.control('not-a-date', {
        validators: [dateComparisonValidator(hireDate)],
      });
      control.markAsDirty();
      control.updateValueAndValidity();
      expect(control.errors).toBeNull();
    });
  });
});
