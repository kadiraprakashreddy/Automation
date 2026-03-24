import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';
// be sure to add a default and a wildcard ** route to handle all scenarios
// wildcard route should be the last one
const routes: Routes = [
    { path: '', component: LibraryComponent },
    { path: ':chapterId', component: LibraryComponent }
];

@NgModule({
    // by default use hash based so we don't need to set base href
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
