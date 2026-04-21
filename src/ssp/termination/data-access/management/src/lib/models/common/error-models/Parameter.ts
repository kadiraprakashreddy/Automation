/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of Parameter model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { ParameterType } from './ParameterType';

export class Parameter {
  name: string | null | undefined;
  type!: ParameterType | null | undefined;
  value!: string | null | undefined;
}
