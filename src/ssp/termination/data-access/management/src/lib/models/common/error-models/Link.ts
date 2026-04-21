/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of Link model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
type StringNullType = string | null | undefined;
export interface ILink {
  rel: StringNullType;
  href: StringNullType;
  type: StringNullType;
  description: StringNullType;
}
