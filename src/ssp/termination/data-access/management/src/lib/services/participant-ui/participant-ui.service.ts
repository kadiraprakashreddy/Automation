/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This file ParticipantUI service to handle UI behavior for participant termination process
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { DOCUMENT, Injectable, inject } from '@angular/core';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import { EmploymentDetailsModel } from '../../models/employment-details.model';
import { isNullOrUndefinedOrEmpty } from '../../validators/utils/utils.validator';
import { ParticipantWindow } from '../../models/participant-window';

@Injectable({
  providedIn: 'root',
})
export class ParticipantUI {
  public shouldDisplayTermModels: boolean = false;
  public contentURI: string | undefined;

  readonly document = inject(DOCUMENT);
  readonly windowService = inject(FdWindowService);

  /**
   * Sets the UI behavior for termination management based on employment details and update success status.
   *
   * This method evaluates the termination date to determine if it's in the future and adjusts the display
   * of termination models and the content URI accordingly. If the termination date is in the future and
   * the update was not successful, it enables the display of term models and sets the content URI to
   * term model content. If the update was successful, it disables the display and resets to default content.
   * If no termination date is provided, it defaults to displaying term models with term model content.
   *
   * @param employmentDetailsModel - The model containing employment and termination details.
   * @param updateSuccess - A boolean indicating whether the update operation was successful.
   */
  public setUIBehavior(
    employmentDetailsModel: EmploymentDetailsModel,
    updateSuccess: boolean,
  ) {
    const win =
      this.windowService?.getWindow?.() ??
      (this.document.defaultView as unknown as ParticipantWindow);
    this.contentURI = win?.apis?.content;
    let isFutureDate: boolean;
    this.shouldDisplayTermModels = false;

    if (employmentDetailsModel.terminationDetails?.terminationDate) {
      const currentDate = new Date();
      const termDate = new Date(
        employmentDetailsModel.terminationDetails?.terminationDate,
      );
      isFutureDate = termDate > currentDate;
      if (isFutureDate && !updateSuccess) {
        this.shouldDisplayTermModels = true;
        this.contentURI = win?.apis?.termModelContent;
      } else if (updateSuccess) {
        this.shouldDisplayTermModels = false;
        this.contentURI = win?.apis?.content;
      }
    } else if (
      isNullOrUndefinedOrEmpty(
        employmentDetailsModel.terminationDetails?.terminationDate,
      )
    ) {
      this.shouldDisplayTermModels = true;
      this.contentURI = win?.apis?.termModelContent;
    }
  }
}
