import { TocInterface } from './toc.interface';

/**
 * @copyright 2020-2021, FMR LLC
 * @file Interface for OverviewContent.
 * @author Preeti Chaurasia (a634796)
 */
export interface OverviewContentInterface {
    'title': string;
    'description': string;
    'tocLabel': string;
    'goLabel': string;
    'accessibilityBackLabel': string;
    'toc': TocInterface[];
    'footnotes': string;
    'transcriptLabel': string;
}
