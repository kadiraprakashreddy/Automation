/**
 * @copyright 2026, FMR LLC
 * @file Test file for error handling utils
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import {
  DEFAULT_TECHNICAL_ERROR_BODY,
  ErrorHandlingUtils,
} from './error-handling-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { mockTridionHttpErrorRestResponse } from '../mocks/termination-management/failure/tridionHttpErrorResponse.mock';
import { mockTridionHttpErrorRestResponseStack } from '../mocks/termination-management/failure/tridionHttpErrorResponseStack.mock';
import { mockTridionHttpErrorRestResponseTitle } from '../mocks/termination-management/failure/tridionHttpErrorResponseTitle.mock';

describe('ErrorHandlingUtils (Spectator)', () => {
  const defaultTechnicalErrorOccurredHeading =
    "Sorry, we've run into a small problem.";

  // No need for createServiceFactory since all methods are static

  it('should have correct DEFAULT_TECHNICAL_ERROR_BODY (line 7-9)', () => {
    expect(DEFAULT_TECHNICAL_ERROR_BODY).toBe(
      "Don't worry, it's nothing you did, just a minor system error on our end. We're working on it and hope to have it resolved soon. Please try again later.",
    );
  });

  it('should get the default error messages when httpErrorResponse is null', () => {
    const errorMsg = ErrorHandlingUtils.getErrorMessage(undefined, '', '');
    expect(errorMsg.title).toEqual(defaultTechnicalErrorOccurredHeading);
  });

  it('should return false if error is a non-JSON string (covering catch block)', () => {
    const httpErrorResponse = new HttpErrorResponse({
      error: '<html>This is not JSON</html>',
      status: 500,
      statusText: 'Server Error',
    });
    // Directly test isErrorResponseWithRefCode to cover the catch
    const result =
      ErrorHandlingUtils.isErrorResponseWithRefCode(httpErrorResponse);
    expect(result).toBe(false);
  });

  it('should return false if httpErrorResponse.error is undefined (line 49)', () => {
    const httpErrorResponse = {
      error: undefined,
      status: 500,
      statusText: 'Server Error',
    } as HttpErrorResponse;
    const result =
      ErrorHandlingUtils.isErrorResponseWithRefCode(httpErrorResponse);
    expect(result).toBe(false);
  });

  it('should get the default error messages when error is string', () => {
    const errorMsg = ErrorHandlingUtils.getErrorMessage(
      new HttpErrorResponse({
        error: '404 error',
        status: 404,
        statusText: 'Not Found',
      }),
      '',
      '',
    );
    expect(errorMsg.title).toEqual(defaultTechnicalErrorOccurredHeading);
  });

  it('should get the error messages when error is object', () => {
    const errorMsg = ErrorHandlingUtils.getErrorMessage(
      new HttpErrorResponse({
        error: mockTridionHttpErrorRestResponse,
        status: 404,
        statusText: 'Not Found',
      }),
    );
    expect(errorMsg.title).toEqual(defaultTechnicalErrorOccurredHeading);
    expect(errorMsg.detail).toContain(DEFAULT_TECHNICAL_ERROR_BODY);
  });

  it('should get the error messages when error is object and custom messages', () => {
    const errorMsg = ErrorHandlingUtils.getErrorMessage(
      new HttpErrorResponse({
        error: mockTridionHttpErrorRestResponse,
        status: 404,
        statusText: 'Not Found',
      }),
      'technicalErrorOccurredMessage',
      'refreshThePageMessage',
    );
    expect(errorMsg.title).toEqual('technicalErrorOccurredMessage');
  });

  it('should get the error messages when error is object and without title', () => {
    const errorMsg = ErrorHandlingUtils.getErrorMessage(
      new HttpErrorResponse({
        error: mockTridionHttpErrorRestResponseTitle,
        status: 404,
        statusText: 'Not Found',
      }),
      'technicalErrorOccurredMessage',
      'refreshThePageMessage',
    );
    expect(errorMsg.title).toEqual('technicalErrorOccurredMessage');
  });

  it('should get the error messages when error is obj and contains stack', () => {
    const errorMsg = ErrorHandlingUtils.getErrorMessage(
      new HttpErrorResponse({
        error: mockTridionHttpErrorRestResponseStack,
        status: 404,
        statusText: 'Not Found',
      }),
      '',
      '',
    );
    expect(errorMsg.title).toEqual(defaultTechnicalErrorOccurredHeading);
  });

  it('should not add duplicate Reference code label if body already contains it', () => {
    const customBodyWithRefCode =
      DEFAULT_TECHNICAL_ERROR_BODY + ' Reference code ABC123 ';
    const errorMsg = ErrorHandlingUtils.getErrorMessage(
      new HttpErrorResponse({
        error: mockTridionHttpErrorRestResponse,
        status: 404,
        statusText: 'Not Found',
      }),
      undefined,
      customBodyWithRefCode,
    );
    expect(errorMsg.detail).toBe(
      customBodyWithRefCode +
        '  ' +
        mockTridionHttpErrorRestResponse.errors[0].title,
    );
    expect(errorMsg.detail).not.toContain('Reference code Reference code');
  });

  it('should not set detail when error object has no title (if condition false)', () => {
    const mockWithoutTitle = {
      errors: [
        {
          code: 'F-WSDPER-SPTERM-100400',
          detail: 'A system error occurred for the requested action.',
        },
      ],
    };
    const errorMsg = ErrorHandlingUtils.getErrorMessage(
      new HttpErrorResponse({
        error: mockWithoutTitle,
        status: 404,
        statusText: 'Not Found',
      }),
      undefined,
      undefined,
    );
    expect(errorMsg.title).toEqual(defaultTechnicalErrorOccurredHeading);
    expect(errorMsg.detail).toEqual(DEFAULT_TECHNICAL_ERROR_BODY);
    expect(errorMsg.detail).not.toContain('Reference code');
  });
});
