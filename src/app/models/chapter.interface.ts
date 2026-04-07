import { ArticleInterface } from './article.interface';

/**
 * @copyright 2020-2021, FMR LLC
 * @file Interface for Chapter.
 * @author Preeti Chaurasia (a634796)
 */
export interface ChapterInterface {
    'title': string;
    'articles': ArticleInterface[];
    'footnotes': string;
}
