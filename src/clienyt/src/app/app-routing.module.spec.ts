import { Routes } from '@angular/router';
import { routes } from './app.routes';
import { LibraryComponent } from './components/library/library.component';

describe('app.routes', () => {

    it('should define the routes correctly', () => {
        expect(routes).toBeTruthy();
        expect(routes.length).toBe(2);

        // Test the default route
        const defaultRoute = routes.find((route) => {
            return route.path === '';
        });
        expect(defaultRoute).toBeTruthy();
        expect(defaultRoute?.component).toBe(LibraryComponent);

        // Test the dynamic chapterId route
        const chapterRoute = routes.find((route) => {
            return route.path === ':chapterId';
        });
        expect(chapterRoute).toBeTruthy();
        expect(chapterRoute?.component).toBe(LibraryComponent);
    });
});
