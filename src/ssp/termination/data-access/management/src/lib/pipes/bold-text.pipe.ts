/**
 * @copyright 2026, FMR LLC
 * @file This is file for boldText pipe
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { Pipe, PipeTransform, SecurityContext, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'boldText',
})
export class BoldTextPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * This function is used to call the necessary methods to add bold font to a sub text value.
   *
   * @param value full string
   * @param subTextValue value to be bolded
   */
  transform(value: string, subTextValue: string): string | null {
    return this.sanitize(this.replace(value, subTextValue));
  }

  /**
   * This function is used to add bold font to a sub text value.
   *
   * @param value full string
   * @param subTextValue value to be bolded
   */
  replace(value: string, subTextValue: string): string {
    if (subTextValue && value) {
      value = value.replace(subTextValue, '<b>' + subTextValue + '</b>');
    }
    return value;
  }

  /**
   * This function is used to sanitize the string for bad HTML.
   *
   * @param value full string
   */
  sanitize(value: string): string | null {
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }
}
