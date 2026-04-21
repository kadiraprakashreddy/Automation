/**
 * @copyright 2026, FMR LLC
 * @file This file contains utility functions for validating values in termination management feature
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  /**
   * Check whether a string is NULL or undefined or it is blank
   *
   * @param item Item
   * @returns
   */
  public isStringNotEmpty(item: string | null | undefined): boolean {
    if (item === null || item === undefined || item.trim().length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Check whether an item is NULL or undefined
   *
   * @param item Item
   * @returns
   */
  public isNullOrUndefined(item: unknown): boolean {
    if (item === null || item === undefined) {
      return true;
    }
    return false;
  }
}
