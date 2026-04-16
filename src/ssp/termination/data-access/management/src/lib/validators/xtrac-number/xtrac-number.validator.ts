/**
 * @copyright 2026, FMR LLC
 * @file This file contains customXTRAC Number validator
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidDate } from '../utils/utils.validator';

const months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

/**
 * This is xtrac number validator function.
 * W######-DDMonYY
 * W123456-24JUN21
 *
 * @export
 * @return
 */
export function xtracNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const xtracNumber = control.value;

    // Object to return if xtrac number is invalid
    const invalidXtrac = { invalidXtracNumber: true };

    if (
      !xtracNumber.match(
        /^(W)(\d){6}-(\d){2}(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(\d){2}$/gi,
      )
    ) {
      return invalidXtrac;
    }

    const date = xtracNumber.split('-')[1];
    const month = date.substring(2, 5).toLowerCase();
    const day = +date.substring(0, 2);
    const year = +('20' + date.substring(5, 7));

    const monthIndex = months.indexOf(month);

    // Object to return if date is invalid in xtrac number
    const invalid = { invalidDateInXtracNumber: true };

    if (!isValidDate(day, monthIndex, year)) {
      return invalid;
    }

    return null;
  };
}
