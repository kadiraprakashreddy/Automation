/**
 * @copyright 2026, FMR LLC
 * @file This file contains utility functions for error handling in termination management feature
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { ErrorMessage } from '../models/common/error-models/ErrorMessage';
import { HttpErrorResponse } from '@angular/common/http';

export const DEFAULT_TECHNICAL_ERROR_TITLE: string =
  "Sorry, we've run into a small problem.";

export const DEFAULT_TECHNICAL_ERROR_BODY: string =
  "Don't worry, it's nothing you did, just a minor system error on our end." +
  " We're working on it and hope to have it resolved soon. Please try again later.";
let defaultReferenceCodeLabel: string = 'Reference code';

interface ErrorWithErrorsArray {
  error?: {
    errors?: Array<{ title?: string }>;
  };
}

export class ErrorHandlingUtils {
  public static isErrorResponseWithRefCode(
    httpErrorResponse?: HttpErrorResponse,
  ): boolean {
    if (!httpErrorResponse) {
      return false;
    }
    if (httpErrorResponse.error !== undefined) {
      let errorWithinResponse = httpErrorResponse.error;
      if (typeof errorWithinResponse === 'string') {
        try {
          errorWithinResponse = JSON.parse(errorWithinResponse);
        } catch (exception) {
          // This exception has been observed through cata
          console.warn(
            'Error response body is not a valid JSON, cannot parse to check for reference code',
            exception,
          );
          return false;
        }
      }

      if (
        errorWithinResponse.error !== undefined &&
        errorWithinResponse.error.stack !== undefined
      ) {
        // This occurs when backend webapp is down, error with html body will be returned
        // which throws an exception when JSON.parse() is called on it

        // Set a default error
        return false;
      } else {
        return this.hasReferenceCode(httpErrorResponse);
      }
    }
    return false;
  }

  public static getErrorMessage(
    httpErrorResponse?: HttpErrorResponse,
    technicalErrorOccurredMessage?: string,
    refreshThePageMessage?: string,
  ): ErrorMessage {
    // Create an error message to add to the collection of error messages
    const errorMessage: ErrorMessage = new ErrorMessage();

    // Custom messages - set defaults if they're null (will happen in the case the webapp is up but tridion call fails)
    errorMessage.title = technicalErrorOccurredMessage
      ? technicalErrorOccurredMessage
      : DEFAULT_TECHNICAL_ERROR_TITLE;

    // create a message which goes before reference code in case we have tridion message response or not
    const bodyToInsertBeforeRefCode: string = refreshThePageMessage
      ? refreshThePageMessage
      : DEFAULT_TECHNICAL_ERROR_BODY;

    if (
      this.isErrorResponseWithRefCode(httpErrorResponse) &&
      httpErrorResponse?.error.errors[0].title
    ) {
      // if there is a reference code, add it to the message
      // "title" from httpErrorResponse - 2FA 11:04 etc... the reference code

      // only add reference code if alert body don't have one
      defaultReferenceCodeLabel = !bodyToInsertBeforeRefCode.includes(
        defaultReferenceCodeLabel,
      )
        ? defaultReferenceCodeLabel
        : '';
      errorMessage.detail =
        bodyToInsertBeforeRefCode +
        ' ' +
        defaultReferenceCodeLabel +
        ' ' +
        httpErrorResponse.error.errors[0].title;
    }

    return errorMessage;
  }

  private static hasReferenceCode(
    errorWithinHttpErrorResponse: ErrorWithErrorsArray,
  ): boolean {
    const errors = errorWithinHttpErrorResponse?.error?.errors;
    return Array.isArray(errors) && errors.length > 0 && !!errors[0]?.title;
  }
}
