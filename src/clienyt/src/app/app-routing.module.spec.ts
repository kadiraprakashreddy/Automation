import { TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { LibraryComponent } from './components/library/library.component';

describe('AppRoutingModule', () => {
    let routes: Routes;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppRoutingModule]
        });

        // Extract the routes from the AppRoutingModule
        routes = TestBed.inject(Router).config;
    });

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

    it('should configure RouterModule with useHash set to true', () => {
        const router = TestBed.inject(Router);
        const routerConfig = router.config;

        // Check that the RouterModule is configured with useHash: true
        expect(routerConfig).toBeTruthy();
        expect(router.config).toEqual(routes);
    });
});
