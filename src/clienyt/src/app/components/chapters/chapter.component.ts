import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ChapterInterface } from '../../models/chapter.interface';
import { ParagraphComponent } from '../paragraph/paragraph.component';

/**
 * @copyright 2020-2022, FMR LLC
 * @file component for chapter
 * @author Preeti Chaurasia (a634796)
 */

@Component({
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.scss'],
    standalone: true,
    imports: [CommonModule, ParagraphComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChapterComponent {

    /** Signifies that the property can receive its value from chapter component. */
    @Input() chapterContent: ChapterInterface;

    /** Label for the transcript url to be passed to paragragh component */
    @Input() transcriptLabel: string;

    /** Flag to determine if chapter content call is in progress */
    @Input() chapterContentLoading: boolean;

    /** constructor */
    constructor() {
    }
}
