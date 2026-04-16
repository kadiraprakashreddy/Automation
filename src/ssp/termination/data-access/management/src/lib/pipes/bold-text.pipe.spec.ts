/**
 * @copyright 2026, FMR LLC
 * @file Unit tests for bold text pipe
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import {
  SpectatorService,
  createServiceFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { BoldTextPipe } from './bold-text.pipe';

interface BoldTextPipeWithPrivate extends BoldTextPipe {
  replace(value: string, subTextValue: string): string;
}

describe('BoldTextPipe', () => {
  let spectator: SpectatorService<BoldTextPipe>;
  let pipe: BoldTextPipe;
  let sanitizer: DomSanitizer;
  const createService = createServiceFactory({
    service: BoldTextPipe,
    providers: [mockProvider(DomSanitizer, { sanitize: jest.fn() })],
  });

  beforeEach(() => {
    spectator = createService();
    sanitizer = spectator.inject(DomSanitizer);
    pipe = spectator.service;
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform method', () => {
    it('should return sanitized string with bold text when subTextValue is found', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue('Hello <b>world</b>!');

      const result = pipe.transform('Hello world!', 'world');

      expect(sanitizer.sanitize).toHaveBeenCalledWith(
        SecurityContext.HTML,
        'Hello <b>world</b>!',
      );
      expect(result).toBe('Hello <b>world</b>!');
    });

    it('should not bold if subTextValue is empty', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue('Hello world!');

      const result = pipe.transform('Hello world!', '');

      expect(sanitizer.sanitize).toHaveBeenCalledWith(
        SecurityContext.HTML,
        'Hello world!',
      );
      expect(result).toBe('Hello world!');
    });

    it('should not bold if subTextValue is not found', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue('Hello world!');

      const result = pipe.transform('Hello world!', 'test');

      expect(sanitizer.sanitize).toHaveBeenCalledWith(
        SecurityContext.HTML,
        'Hello world!',
      );
      expect(result).toBe('Hello world!');
    });

    it('should bold only the first occurrence', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue(
        'Hello <b>world</b> world!',
      );

      const result = pipe.transform('Hello world world!', 'world');

      expect(sanitizer.sanitize).toHaveBeenCalledWith(
        SecurityContext.HTML,
        'Hello <b>world</b> world!',
      );
      expect(result).toBe('Hello <b>world</b> world!');
    });

    it('should return null if sanitizer returns null', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue(null);

      const result = pipe.transform('Hello world!', 'world');

      expect(result).toBeNull();
    });

    it('should handle empty value', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue('');

      const result = pipe.transform('', 'test');

      expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.HTML, '');
      expect(result).toBe('');
    });
  });

  describe('replace method', () => {
    it('should replace subTextValue with bold tags when subTextValue is truthy', () => {
      const result = (pipe as BoldTextPipeWithPrivate).replace(
        'Hello world!',
        'world',
      );
      expect(result).toBe('Hello <b>world</b>!');
    });

    it('should not replace when subTextValue is empty string', () => {
      const result = (pipe as BoldTextPipeWithPrivate).replace(
        'Hello world!',
        '',
      );
      expect(result).toBe('Hello world!');
    });

    it('should not replace when subTextValue is not found', () => {
      const result = (pipe as BoldTextPipeWithPrivate).replace(
        'Hello world!',
        'test',
      );
      expect(result).toBe('Hello world!');
    });

    it('should not replace when value is empty string', () => {
      const result = (pipe as BoldTextPipeWithPrivate).replace('', 'test');
      expect(result).toBe('');
    });
  });

  describe('sanitize method', () => {
    it('should call sanitizer.sanitize with SecurityContext.HTML', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue('sanitized');

      const result = (pipe as BoldTextPipeWithPrivate).sanitize('<b>test</b>');

      expect(sanitizer.sanitize).toHaveBeenCalledWith(
        SecurityContext.HTML,
        '<b>test</b>',
      );
      expect(result).toBe('sanitized');
    });

    it('should return null when sanitizer returns null', () => {
      (sanitizer.sanitize as jest.Mock).mockReturnValue(null);

      const result = (pipe as BoldTextPipeWithPrivate).sanitize('<b>test</b>');

      expect(result).toBeNull();
    });
  });

  it('should return sanitized string with bold text', () => {
    (sanitizer.sanitize as jest.Mock).mockReturnValue('Hello <b>world</b>!');

    const result = pipe.transform('Hello world!', 'world');

    expect(sanitizer.sanitize).toHaveBeenCalledWith(
      SecurityContext.HTML,
      'Hello <b>world</b>!',
    );
    expect(result).toBe('Hello <b>world</b>!');
  });

  it('should not bold if subTextValue is empty', () => {
    (sanitizer.sanitize as jest.Mock).mockReturnValue('Hello world!');

    const result = pipe.transform('Hello world!', '');

    expect(sanitizer.sanitize).toHaveBeenCalledWith(
      SecurityContext.HTML,
      'Hello world!',
    );
    expect(result).toBe('Hello world!');
  });

  it('should not bold if subTextValue is not found', () => {
    (sanitizer.sanitize as jest.Mock).mockReturnValue('Hello world!');

    const result = pipe.transform('Hello world!', 'test');

    expect(sanitizer.sanitize).toHaveBeenCalledWith(
      SecurityContext.HTML,
      'Hello world!',
    );
    expect(result).toBe('Hello world!');
  });

  it('should bold only the first occurrence', () => {
    (sanitizer.sanitize as jest.Mock).mockReturnValue(
      'Hello <b>world</b> world!',
    );

    const result = pipe.transform('Hello world world!', 'world');

    expect(sanitizer.sanitize).toHaveBeenCalledWith(
      SecurityContext.HTML,
      'Hello <b>world</b> world!',
    );
    expect(result).toBe('Hello <b>world</b> world!');
  });

  it('should return null if sanitizer returns null', () => {
    (sanitizer.sanitize as jest.Mock).mockReturnValue(null);

    const result = pipe.transform('Hello world!', 'world');

    expect(result).toBeNull();
  });

  it('should handle empty value', () => {
    (sanitizer.sanitize as jest.Mock).mockReturnValue('');

    const result = pipe.transform('', 'test');

    expect(sanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.HTML, '');
    expect(result).toBe('');
  });
});
