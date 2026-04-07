/**
 * @copyright 2020-2021, FMR LLC
 * @file Parent component for Help and Learning
 * @author Preeti Chaurasia (a634796)
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {

}
