import { ParagraphInterface } from './paragraph.interface';

/**
 * @copyright 2020-2021, FMR LLC
 * @file Interface for Article.
 * @author Preeti Chaurasia (a634796)
 */
export interface ArticleInterface {
    'articleHeading': string;
    'articleSubHeading': string;
    'paragraphs': ParagraphInterface[];
    'subArticles': ArticleInterface[];
}
