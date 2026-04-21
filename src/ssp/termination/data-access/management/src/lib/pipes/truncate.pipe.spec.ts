/**
 * @copyright 2026, FMR LLC
 * @file Unit tests for truncate.pipe.ts
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should truncate string when length exceeds limit', () => {
    const result = pipe.transform('hello world', 5, / /g);
    expect(result).toBe('hello');
  });

  it('should not truncate if length is less than limit', () => {
    const result = pipe.transform('hello', 10, /x/g);
    expect(result).toBe('hello');
  });

  it('should remove characters matching regex', () => {
    const result = pipe.transform('h3llo w0rld', 5, /\d/g);
    expect(result).toBe('hllo ');
  });

  it('should handle empty string', () => {
    const result = pipe.transform('', 5, /a/g);
    expect(result).toBe('');
  });

  it('should handle limit of 0', () => {
    const result = pipe.transform('hello', 0, /l/g);
    expect(result).toBe('');
  });

  it('should handle regex that matches nothing', () => {
    const result = pipe.transform('hello', 3, /z/g);
    expect(result).toBe('hel');
  });

  it('should handle regex that matches all', () => {
    const result = pipe.transform('hello', 5, /./g);
    expect(result).toBe('');
  });
});
