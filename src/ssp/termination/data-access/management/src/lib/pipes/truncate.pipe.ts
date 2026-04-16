/**
 * @copyright 2026, FMR LLC
 * @file This is file for truncate pipe
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe truncates a string.
 * Use it like so {{ String expression | truncate:10 }}
 * This truncates the string to 10 letters and remove all char
 * that does not match given regExp
 *
 * @export
 * @class TruncatePipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  /**
   * transform method to truncate invalid char and extra length
   *
   * @param value
   * @param limit
   * @param regExp
   * @return
   * @memberof TruncatePipe
   */
  transform(value: string, limit: number, regExp: RegExp): string {
    const newValue = value.replace(regExp, '');
    return newValue.length < limit ? newValue : newValue.slice(0, limit);
  }
}
