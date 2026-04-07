import { Routes } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';

export const routes: Routes = [
    { path: '', component: LibraryComponent },
    { path: ':chapterId', component: LibraryComponent }
];
