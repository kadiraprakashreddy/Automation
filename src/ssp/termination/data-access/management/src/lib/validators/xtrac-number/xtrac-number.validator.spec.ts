/**
 * @copyright 2021, FMR LLC
 * @file This file contains test for customXTRAC Number validator
 * @author Prince (a638319)
 */

import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { xtracNumberValidator } from './xtrac-number.validator';

describe('xTRAC Number Validator', () => {
  const fb: UntypedFormBuilder = new UntypedFormBuilder();

  it('should return null for valid xtrac number', () => {
    const validXtracNumber: UntypedFormControl = fb.control('W123456-21Jun20', {
      validators: [xtracNumberValidator()],
    });
    expect(validXtracNumber.valid).toBeTruthy();
  });

  it('should return null for another valid xtrac number', () => {
    const validXtracNumber: UntypedFormControl = fb.control('W654321-15Dec25', {
      validators: [xtracNumberValidator()],
    });
    expect(validXtracNumber.valid).toBeTruthy();
  });

  it('should return error for invalid date in xtrac number (31 Feb)', () => {
    const invalidXtracNumber: UntypedFormControl = fb.control(
      'W123456-31Feb20',
      {
        validators: [xtracNumberValidator()],
      },
    );
    expect(invalidXtracNumber.invalid).toBeTruthy();
    expect(invalidXtracNumber.errors).toEqual({
      invalidDateInXtracNumber: true,
    });
  });

  it('should return error for invalid date in xtrac number (Feb 29 non-leap year)', () => {
    const invalidXtracNumber: UntypedFormControl = fb.control(
      'W123456-29Feb21',
      {
        validators: [xtracNumberValidator()],
      },
    );
    expect(invalidXtracNumber.invalid).toBeTruthy();
    expect(invalidXtracNumber.errors).toEqual({
      invalidDateInXtracNumber: true,
    });
  });

  it('should return error for invalid date in xtrac number (31 Apr)', () => {
    const invalidXtracNumber: UntypedFormControl = fb.control(
      'W123456-31Apr20',
      {
        validators: [xtracNumberValidator()],
      },
    );
    expect(invalidXtracNumber.invalid).toBeTruthy();
    expect(invalidXtracNumber.errors).toEqual({
      invalidDateInXtracNumber: true,
    });
  });

  it('should return error for invalid xtrac number format', () => {
    const invalidXtracNumber: UntypedFormControl = fb.control(
      'X123456-21Jun20',
      {
        validators: [xtracNumberValidator()],
      },
    );
    expect(invalidXtracNumber.invalid).toBeTruthy();
    expect(invalidXtracNumber.errors).toEqual({ invalidXtracNumber: true });
  });

  it('should return error for invalid xtrac number with wrong month', () => {
    const invalidXtracNumber: UntypedFormControl = fb.control(
      'W123456-21XYZ20',
      {
        validators: [xtracNumberValidator()],
      },
    );
    expect(invalidXtracNumber.invalid).toBeTruthy();
    expect(invalidXtracNumber.errors).toEqual({ invalidXtracNumber: true });
  });
});
