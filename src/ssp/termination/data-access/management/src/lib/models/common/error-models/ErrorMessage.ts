/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of ErrorMessage model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import {
  DEFAULT_TECHNICAL_ERROR_BODY,
  DEFAULT_TECHNICAL_ERROR_TITLE,
} from '../../../utilities/error-handling-utils';
import { ILink } from './Link';
import { Parameter } from './Parameter';
export class ErrorMessage {
  code: string | null | undefined;
  title: string = DEFAULT_TECHNICAL_ERROR_TITLE;
  detail: string = DEFAULT_TECHNICAL_ERROR_BODY;
  parameters!: Parameter[];
  links: ILink[] | null | undefined;
}
