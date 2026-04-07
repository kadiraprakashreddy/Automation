import { Routes } from '@angular/router';
import { routes } from './app.routes';
import { LibraryComponent } from './components/library/library.component';

describe('app.routes', () => {
    let appRoutes: Routes;

    beforeEach(() => {
        appRoutes = routes;
    });

    it('should define the routes correctly', () => {
        expect(appRoutes).toBeTruthy();
        expect(appRoutes.length).toBe(2);

        // Test the default route
        const defaultRoute = appRoutes.find((route) => {
            return route.path === '';
        });
        expect(defaultRoute).toBeTruthy();
        expect(defaultRoute?.component).toBe(LibraryComponent);

        // Test the dynamic chapterId route
        const chapterRoute = appRoutes.find((route) => {
            return route.path === ':chapterId';
        });
        expect(chapterRoute).toBeTruthy();
        expect(chapterRoute?.component).toBe(LibraryComponent);
    });

    it('should not use redirect routes', () => {
        appRoutes.forEach((route) => {
            expect(route.redirectTo).toBeUndefined();
        });
    });

    it('should have unique route paths', () => {
        const paths = appRoutes.map((route) => {
            return route.path;
        });
        expect(new Set(paths).size).toBe(paths.length);
    });

    it('should render LibraryComponent for all configured routes', () => {
        appRoutes.forEach((route) => {
            expect(route.component).toBe(LibraryComponent);
        });
    });
});
