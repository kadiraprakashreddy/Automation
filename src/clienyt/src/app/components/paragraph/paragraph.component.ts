import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ChapterInterface } from '../../models/chapter.interface';
import { ArticleInterface } from '../../models/article.interface';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import { PlayerConfiguration, VideoModule } from '@fmr-ap137030/video-component';
import { CUSTOM_ELEMENT_SCHEMAS } from '../../custom-elements.schema';

/**
 * @copyright 2020-2021, FMR LLC
 * @file component for paragraph
 * @author Preeti Chaurasia (a634796)
 */

@Component({
    selector: 'app-paragraph',
    templateUrl: './paragraph.component.html',
    styleUrls: ['./paragraph.component.scss'],
    imports: [NgTemplateOutlet, VideoModule],
    encapsulation: ViewEncapsulation.None,
    schemas: CUSTOM_ELEMENT_SCHEMAS
})
export class ParagraphComponent implements OnChanges, OnInit {

    /** Signifies that the property can receive its value from chapter component. */
    @Input() chapterContent: ChapterInterface;

    /** Label for video transcript link */
    @Input() transcriptLabel: string;

    /** article interface */
    articles: ArticleInterface[];

    /** Configuration needed for embedded brightcove videos */
    playerConfiguration: PlayerConfiguration;

    /** constructor */
    constructor(private fdWindowService: FdWindowService) {
    }

    /**
     * Called during initialization of component
     */
    ngOnInit() {
        this.playerConfiguration = new PlayerConfiguration(this.fdWindowService.getWindow().brightcoveConfig?.accountId,
            this.fdWindowService.getWindow().brightcoveConfig?.playerId, this.fdWindowService.getWindow().brightcoveConfig?.scripts);
    }

    /**
     * Called when any data-bound property of a directive changes.
     *
     *  @memberof ParagraphComponent
     */
    ngOnChanges() {
        this.articles = this.chapterContent.articles;
    }

}
