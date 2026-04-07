import { OverviewContentInterface } from './models/overviewContent.interface';
import { TocInterface } from './models/toc.interface';
import { ChapterInterface } from './models/chapter.interface';

/**
 * @copyright 2020-2021, FMR LLC
 * @file This file is responsible for providing testdata for the testComponent.
 * @author Preeti Chaurasia(a634796)
 */

export const overviewContent: OverviewContentInterface = {
    title: 'SPS Quick Reference Guide',
    description: 'Descriptive text about the page',
    tocLabel: 'Table of Contents',
    goLabel: 'Go',
    accessibilityBackLabel: 'Back Label',
    transcriptLabel: 'View transcript (PDF)',
    toc: [
        {
            deprecation: null,
            href: '/plansponsor/custsupport/api/products/sps/books/sps-help/chapters/selectAChapter.html',
            hreflang: null,
            media: null,
            rel: 'self',
            title: 'Select a chapter',
            type: null
        },
        {
            deprecation: null,
            href: '/plansponsor/custsupport/api/products/sps/books/sps-help/chapters/Distributions.html',
            hreflang: null,
            media: null,
            rel: 'self',
            title: 'Distributions',
            type: null
        },
        {
            deprecation: null,
            href: '/plansponsor/custsupport/api/products/sps/books/sps-help/chapters/manageandapprovedistributions.html',
            hreflang: null,
            media: null,
            rel: 'self',
            title: 'Manage and approve distributions',
            type: null
        }
    ],
    footnotes: '<p>For Plan Sponsor Use Only. Fidelity Stock Plan Services, LLC provides recordkeeping and/or administrative ' +
               'services to your companys equity compensation plan, in addition to any services provided directly to the plan ' +
               'by your company or its service providers.</p>\r\n<p>© ~(CURRENT_YEAR)~ FMR LLC. All rights reserved.</p>\r\n<p>' +
               '949768.1.0</p>'
};

export const tocListExample: TocInterface[] = [
    {
        deprecation: null,
        href: 'href/example1',
        hreflang: null,
        media: null,
        rel: 'self',
        title: 'toc list example title 1',
        type: null
    },
    {
        deprecation: null,
        href: 'href/example2',
        hreflang: null,
        media: null,
        rel: 'self',
        title: 'toc list example title 2',
        type: null
    }
];

export const tocListExampleJSON: string = '[{"value":"href/example1","text":"toc list example title 1"},'+
'{"value":"href/example2","text":"toc list example title 2"}]';

export const chapterExample: ChapterInterface = {
    title: 'Welcome to the SPS quick reference guide',
    articles: [
        {
            articleHeading: null,
            articleSubHeading: null,
            paragraphs: [
                {
                    type: 'STRING',
                    value: 'Your source to understanding and using Stock Plan Services. Heres what youll find inside:'
                },
                {
                    type: 'STRING',
                    value: '<ul xmlns=\http://www.w3.org/1999/xhtml\npm><li>Basics on equity compensation types</li>' +
                           '<li>Timelines for actions you need to take</li><li>Tools to simplify your workflow</li></ul>'
                },
                {
                    type: 'STRING',
                    value: 'Choose a chapter to get started.'
                }
            ],
            subArticles: null
        }
    ],
    footnotes: 'testing footnotes'
};

export const errorData = {
    errors: [
        {
            code: 'F-WSDPER-ERCUS-100500',
            title: 'ZGK 15 10:18:06',
            detail: 'A system error occurred for the requested action.',
            parameters: null,
            links: null
        }
    ]
};

