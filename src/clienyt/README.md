# PswLibraryClientApp

* This repo utilizes the industry standard Angular CLI along with WI best practices.
* View [Techie Pepper Confluence](https://confluence.fmr.com/display/SEEU/Seed+Client+App) for seed app changelog and other information.

## Getting Started

1) **Initialize the Application**

``` bash
    # install dependencies
    npm install
```

## Development

### Angular dev server and demo server

The seed client app contains 2 servers: webpack dev server from angular cli and an express static content server.
Read more about the demo server in the [demo server readme](./demo/readme.md)

```bash

    # starts angular server running on 4200 that serves the app .js and .css files
    # and a demo server on 4201. Navigate to localhost:4201
    npm run dev

    # if you want to share via ip address instead of local. e.g http://MY_IP_ADDRESS:4201
    npm run dev:internal

    # if you want to serve production build locally
    npm run dev:prod

    # if you want to serve https and wire up to java server
    # angular .js and .css assets will come from localhost:4200
    npm run dev:https

    # if you want to serve https and wire up to java server with production build
    # angular .js and .css assets will come from ip address
    npm run dev:prod:https

```

### Development with local Java server

Many teams like to connect their Angular app to their local java server to test real data scenarios.
We advise to only do this while running your Angular app with AOT.

Steps:

1. Run Angular app via `npm run dev:prod:https` .
2. Reference the relevant files in your jsp. See the example below:

``` html
<head>
    ...
    <!-- fonts (NB only) -->
    <link rel="stylesheet" href="PATH_TO_STATIC_CONTENT/static/common/nb/css/fidelity-sans-fonts.css">
    <!-- fonts (PSW only) -->
    <link rel="stylesheet" type="text/css" href="/bin-public/06_PSW_Website/css/site.css" />

    <!-- css -->
    <!-- check the generated styles in https://localhost:4200/webpack-dev-server -->
    <link rel="stylesheet" href="https://YOUR_IP_ADDRESS:4200/styles.css">
</head>

<body>
    ...
    <!-- js -->
    <!-- Check the generated js files in: https://localhost:4200/webpack-dev-server (order is important): -->
    <script src="https://YOUR_IP_ADDRESS:4200/runtime.js" type="module"></script>
    <script src="https://YOUR_IP_ADDRESS:4200/polyfills.js" type="module"></script>
    <!-- scripts.js is only needed if you added to the angular.json "scripts" array -->
    <script src="https://YOUR_IP_ADDRESS:4200/scripts.js" defer></script>
    <script src="https://YOUR_IP_ADDRESS:4200/main.js" type="module"></script>
</body>
```

3. If your app has lazy loaded modules, then make sure that you also include:

``` html
    <script>
        window.STATIC_CONTENT_LOCATION = 'https://YOUR_IP_ADDRESS:4200/';
    </script>
```

## Design System Integration

All WI projects must use an internal design system.

### Providence

New projects should use the PWI design system: [Providence](http://providence.fmr.com/).  The seed app includes Providence by default. Add any components you need to `app.module.ts` and their corresponding styles to `src/styles.scss`. To optimize performance / reduce bundle size, we recommend importing component-by-component rather than bringing in the full library.

* [Providence Getting Started Guide](http://providence.fmr.com/getting-started-for-developers)

#### Examples - How to use Providence in the Seed App

See our [Seed App examples](https://github.com/Fidelity-Red/ap123285-seed-client-app-with-examples) for full code examples and different use cases.

## Assets

Teams should **host any images their app needs inside SDL**. This can improve performance and you will avoid the need to rebuild your app every time an image is updated.

Refer to [Codex | Images](https://codex.fmr.com/#/standards-and-best-practices/images) for more guidance on adding images to your application.

If you need to bundle assets with your Angular app, the Angular CLI gives a [default configuration](https://angular.io/guide/workspace-config#assets-configuration) that allows you to reference them with a root-relative path inside your Angular components.

Due to limitations with the Angular CLI, you **should only include references to assets as variables in your typescript files**, as this allows more flexibility in updating the path for different environments.

You may need to reference your doc root inside udeploy as part of the assets path. To do so, you can add a variable to the environment.ts files:

```typescript
    // environment.ts
    const assetPath = window.location.protocol + '//' + window.location.hostname + ':4200';
    export const environment = {
        production: false,
        // we add the angular dev server url here so that assets works in demo
        assetsUrl: `${assetPath}/assets/`
    };
    ...
```

```typescript
// environment.prod.ts
const assetPath = (<any>window).STATIC_CONTENT_LOCATION;
export const environment = {
    production: true,
    // change the path to point to where static content will be
    assetsUrl: `${assetPath}/assets/`
};
```
* where `window.STATIC_CONTENT_LOCATION` is set as a global variable within the serverside template telling Angular where to load the assets from.

### Example

If you have an image under `src/assets/my-image.png`, you can reference it inside your Angular component template like so:

```typescript
   public myImgPath = `${environment.assetsUrl}my-image.png`;
```

```html
   <img [src]="myImgPath">
```

## Code Scaffolding

To generate a new component under the components folder:

``` bash
    ng generate component components/component-name
```

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module` . Adjust the path as needed so it gets put into the correct folder.

To do a test run of code scaffolding, you can pass the `--dryRun=true` option. This will show you what files would be created without actually altering your project.

``` bash
    ng generate service services/service-name --dryRun=true
```

See [Angular CLI docs](https://angular.io/cli/generate) for more schematics and options.

## Lazy-load Multi-Modules (if applicable)

Some apps may want to have multiple lazy-loaded modules within their application. Lazy loading modules comes with considerable architecture consideration and are **not needed** for the majority of WI apps although PSW architecture relies heavily on it.

* Consult the **[angular docs](https://angular.io/guide/lazy-loading-ngmodules#create-a-feature-module-with-routing)** for how and when to use lazy-loaded modules.

* Due to WI architecture many apps use `_webpack_public_path__` to dynamically map content urls for lazy-loaded modules. This involves updating `main.ts` to look something like the following:

``` typescript
    declare let __webpack_public_path__: string;
    ...
    __webpack_public_path__ = (<any> window).STATIC_CONTENT_LOCATION || '';
```

* where `window. STATIC_CONTENT_LOCATION` is set as a global variable within the serverside template telling Angular where to load the lazy-loaded modules from.

## Test

### Running unit tests
 

``` bash
    # run unit tests in watch mode
    npm run test:unit

    # run unit tests for only a single run
    npm run test:unit:singlerun

    # run unit tests within a pipeline using headless chrome
    npm run test:unit:CICD
```

### Running end-to-end tests

E2E tests are run via [Playwright](https://playwright.dev/). Playwright is set up to run the bundled demo server on port `:4201` so that you can write E2E tests using your demo pages. The test report will output to `playwright-report/` and any artifacts (such as screenshots, videos, traces) will output to `playwright-artifacts/`.

* [Playwright configuration](./playwright.config.ts)
* [E2E tests](./e2e)
* [Demo server](./demo)

``` bash
    # run e2e tests
    npm run test:e2e

    # run e2e tests in debug mode
    npm run test:e2e:debug

    # run e2e tests within a pipeline using headless chrome
    npm run test:e2e:CICD
```

## Build

There are several types of builds available:

``` bash
    # prod build that does aot, minification and creates a zip
    npm run build

    # veracode build that zips up all source code
    npm run build:veracode

    # pre-release assessment build that will run both a prod buld and veracode build
    npm run build:pra
```

### Prod Builds: Serverside Integration

* Fonts are **no longer bundled** in the client app and will need to be referenced via a `<link>` tag
* See the following example below:

``` html
<head>
    ...
    <!-- Add fonts -->
    <!-- This is for NB -->
    <link rel="stylesheet" href="PATH_TO_STATIC_CONTENT/static/common/nb/css/fidelity-sans-fonts.css">
    <!-- this is for PSW -->
    <link rel="stylesheet" type="text/css" href="/bin-public/06_PSW_Website/css/site.css" />

    <!-- Add app styles -->
    <link rel="stylesheet" href="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/styles.css">
</head>

<body>
    ...
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/runtime.js" type="module"></script>
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/polyfills.js" type="module"></script>
    <!-- this scripts.js is only needed if you added to the angular.json "scripts" array -->
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/scripts.js" defer></script>
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/main.js" type="module"></script>
</body>
```

#### IMPORTANT: NB And PSW

`type="module"` respects CORS, so make sure that `PATH_TO_STATIC_CONTENT` is a root-relative url that **excludes** the host name **if your content is on a different host**.

When loading angular apps using differential-loading, **you must use root-relative urls** and MUST NOT INCLUDE THE HOST in the `src` attribute. Including the host will cause CORS errors in FIN/FAC and mobile prod, causing your page not to load!

Many NB teams have used NB_STATIC_CONTENT_HOST in the past within their script `src`. This WILL NOT WORK for `type="module"` because it includes the hardcoded host. WI-WEB has instructed us to always use root-relative as they will not be updating their CORS policy.

##### Example: Client-side root-relative URLs

```html
<!-- BAD - includes hardcoded host -->
<script src="https://workplaceservices.fidelity.com/static/mybenefits/YourClientAppContent/main.js" type="module"></script>
 <!-- BAD - navproperties.NB_STATIC_CONTENT_HOST includes host -->
<script src="${​​​​​​​​navproperties['NB_STATIC_CONTENT_HOST']}​​​​​​​​/static/mybenefits/YourClientAppContent/main.js" type="module"></script>
<!-- GOOD - root-relative and does not include host -->
<script src="/static/mybenefits/YourClientAppContent/main.js" type="module"></script>
```

## Webpack bundle analyzer

Use webpack bundle analyzer to visualize where code in the final webpack bundles comes from. This helps you identify where you can further optimize your bundles.

```bash
    npm run report
```

## Source map explorer

Source-map-explorer takes a bundle .js file with its generated source maps, and turns them into a tree map. This visualization makes it easy to identify what code is being loaded in each bundle.

```bash
    npm run report:source-map
```

## Upgrades and maintenance

* Go to [Techie Pepper Handbook | Migration Guides](http://techie-pepper-handbook.fmr.com/docs#/angular/application/migration-guides) for guides on migrating to the latest seed app

## Autoprefixer

Grid support is disabled by default by Autoprefixer. To enable grid support add below to the top of all scss files that are using grid.

``` scss
    /*! autoprefixer grid: autoplace */
```

## Help and Support

To get more help on the Angular CLI, use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

* [Techie Pepper Handbook](http://techie-pepper-handbook.fmr.com/docs#)
* [Techie Peppers | Help & Support](http://techie-pepper-handbook.fmr.com/docs#/help-support/overview)
* [Seed App Examples Repo](https://itec-stash.fmr.com/projects/AP123285/repos/ap123285-seed-client-app-with-examples/browse)
# PswLibraryClientApp

* This repo utilizes the industry standard Angular CLI along with WI best practices.
* View [Techie Pepper Confluence](https://confluence.fmr.com/display/SEEU/Seed+Client+App) for seed app changelog and other information.

## Getting Started

[//]: # (RENAME_MESSAGE_START)

# <span style="color:red; font-weight: bold">Important One time Task</span>

1) **Initialize and Rename Application**

* After your **first** install run the following commands:

``` bash
    # install dependencies
    npm install
    # rename repo to your app name, make sure it is kebab case!
    npm run rename my-awesome-app
```

[//]: # (RENAME_MESSAGE_END)

## Development

### Angular dev server and demo server

The seed client app contains 2 servers: webpack dev server from angular cli and an express static content server.
Read more about the demo server in the [demo server readme](./demo/readme.md)

```bash

    # starts angular server running on 4200 that serves the app .js and .css files
    # and a demo server on 4201. Navigate to localhost:4201
    npm run dev

    # if you want to share via ip address instead of local. e.g http://MY_IP_ADDRESS:4201
    npm run dev:internal

    # if you want to serve production build locally
    npm run dev:prod

    # if you want to serve https and wire up to java server
    # angular .js and .css assets will come from localhost:4200
    npm run dev:https

    # if you want to serve https and wire up to java server with production build
    # angular .js and .css assets will come from ip address
    npm run dev:prod:https

```

### Development with local Java server

Many teams like to connect their Angular app to their local java server to test real data scenarios.
We advise to only do this while running your Angular app with AOT.

Steps:

1. Run Angular app via `npm run dev:prod:https` .
2. Reference the relevant files in your jsp. See the example below:

``` html
<head>
    ...
    <!-- fonts (NB only) -->
    <link rel="stylesheet" href="PATH_TO_STATIC_CONTENT/static/common/nb/css/fidelity-sans-fonts.css">
    <!-- fonts (PSW only) -->
    <link rel="stylesheet" type="text/css" href="/bin-public/06_PSW_Website/css/site.css" />

    <!-- css -->
    <!-- check the generated styles in https://localhost:4200/webpack-dev-server -->
    <link rel="stylesheet" href="https://YOUR_IP_ADDRESS:4200/styles.css">
</head>

<body>
    ...
    <!-- js -->
    <!-- Check the generated js files in: https://localhost:4200/webpack-dev-server (order is important): -->
    <script src="https://YOUR_IP_ADDRESS:4200/runtime.js" type="module"></script>
    <script src="https://YOUR_IP_ADDRESS:4200/polyfills.js" type="module"></script>
    <!-- scripts.js is only needed if you added to the angular.json "scripts" array -->
    <script src="https://YOUR_IP_ADDRESS:4200/scripts.js" defer></script>
    <script src="https://YOUR_IP_ADDRESS:4200/main.js" type="module"></script>
</body>
```

3. If your app has lazy loaded modules, then make sure that you also include:

``` html
    <script>
        window.STATIC_CONTENT_LOCATION = 'https://YOUR_IP_ADDRESS:4200/';
    </script>
```

## Design System Integration

All WI projects must use an internal design system.

### Providence

New projects should use the PWI design system: [Providence](http://providence.fmr.com/).  The seed app includes Providence by default. Add any components you need to `app.module.ts` and their corresponding styles to `src/styles.scss`. To optimize performance / reduce bundle size, we recommend importing component-by-component rather than bringing in the full library.

* [Providence Getting Started Guide](http://providence.fmr.com/getting-started-for-developers)

#### Examples - How to use Providence in the Seed App

See our [Seed App examples](https://itec-stash.fmr.com/projects/AP123285/repos/ap123285-seed-client-app-with-examples/browse) for full code examples and different use cases.

## Assets

Teams should **host any images their app needs inside SDL**. This can improve performance and you will avoid the need to rebuild your app every time an image is updated.

Refer to [Techie Pepper Handbook | Images](http://techie-pepper-handbook.fmr.com/docs#/platform-standards/images) for more guidance on adding images to your application.

If you need to bundle assets with your Angular app, the Angular CLI gives a [default configuration](https://angular.io/guide/workspace-config#assets-configuration) that allows you to reference them with a root-relative path inside your Angular components.

Due to limitations with the Angular CLI, you **should only include references to assets as variables in your typescript files**, as this allows more flexibility in updating the path for different environments.

You may need to reference your doc root inside udeploy as part of the assets path. To do so, you can add a variable to the environment.ts files:

```typescript
    // environment.ts
    const assetPath = window.location.protocol + '//' + window.location.hostname + ':4200';
    export const environment = {
        production: false,
        // we add the angular dev server url here so that assets works in demo
        assetsUrl: `${assetPath}/assets/`
    };
    ...
```

```typescript
// environment.prod.ts
const assetPath = (<any>window).STATIC_CONTENT_LOCATION;
export const environment = {
    production: true,
    // change the path to point to where static content will be
    assetsUrl: `${assetPath}/assets/`
};
```
* where `window.STATIC_CONTENT_LOCATION` is set as a global variable within the serverside template telling Angular where to load the assets from.

### Example

If you have an image under `src/assets/my-image.png`, you can reference it inside your Angular component template like so:

```typescript
   public myImgPath = `${environment.assetsUrl}my-image.png`;
```

```html
   <img [src]="myImgPath">
```

## Code Scaffolding

To generate a new component under the components folder:

``` bash
    ng generate component components/component-name
```

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module` . Adjust the path as needed so it gets put into the correct folder.

To do a test run of code scaffolding, you can pass the `--dryRun=true` option. This will show you what files would be created without actually altering your project.

``` bash
    ng generate service services/service-name --dryRun=true
```

See [Angular CLI docs](https://angular.io/cli/generate) for more schematics and options.

## Lazy-load Multi-Modules (if applicable)

Some apps may want to have multiple lazy-loaded modules within their application. Lazy loading modules comes with considerable architecture consideration and are **not needed** for the majority of WI apps although PSW architecture relies heavily on it.

* Consult the **[angular docs](https://angular.io/guide/lazy-loading-ngmodules#create-a-feature-module-with-routing)** for how and when to use lazy-loaded modules.

* Due to WI architecture many apps use `_webpack_public_path__` to dynamically map content urls for lazy-loaded modules. This invloves updating `main.ts` to look something like the following:

``` typescript
    declare let __webpack_public_path__: string;
    ...
    __webpack_public_path__ = (<any> window).STATIC_CONTENT_LOCATION || '';
```

* where `window. STATIC_CONTENT_LOCATION` is set as a global variable within the serverside template telling Angular where to load the lazy-loaded modules from.

## Test

### Running unit tests

 

``` bash
    # run unit tests in watch mode
    npm run test:unit

    # run unit tests for only a single run
    npm run test:unit:singlerun

    # run unit tests within a pipeline using headless chrome
    npm run test:unit:CICD
```

### Running end-to-end tests

E2E tests are run via [Playwright](https://playwright.dev/). Playwright is set up to run the bundled demo server on port `:4201` so that you can write E2E tests using your demo pages. The test report will output to `playwright-report/` and any artifacts (such as screenshots, videos, traces) will output to `playwright-artifacts/`.

* [Playwright configuration](./playwright.config.ts)
* [E2E tests](./e2e)
* [Demo server](./demo)

``` bash
    # run e2e tests
    npm run test:e2e

    # run e2e tests in debug mode
    npm run test:e2e:debug

    # run e2e tests within a pipeline using headless chrome
    npm run test:e2e:CICD
```

## Build

There are several types of builds available:

``` bash
    # prod build that does aot, minification and creates a zip
    npm run build

    # veracode build that zips up all source code
    npm run build:veracode

    # pre-release assessment build that will run both a prod buld and veracode build
    npm run build:pra
```

### Prod Builds: Serverside Integration

* Fonts are **no longer bundled** in the client app and will need to be referenced via a `<link>` tag
* See the following example below:

``` html
<head>
    ...
    <!-- Add fonts -->
    <!-- This is for NB -->
    <link rel="stylesheet" href="PATH_TO_STATIC_CONTENT/static/common/nb/css/fidelity-sans-fonts.css">
    <!-- this is for PSW -->
    <link rel="stylesheet" type="text/css" href="/bin-public/06_PSW_Website/css/site.css" />

    <!-- Add app styles -->
    <link rel="stylesheet" href="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/styles.css">
</head>

<body>
    ...
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/runtime.js" type="module"></script>
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/polyfills.js" type="module"></script>
    <!-- this scripts.js is only needed if you added to the angular.json "scripts" array -->
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/scripts.js" defer></script>
    <script src="PATH_TO_STATIC_CONTENT/pswLibraryClientAppContent/main.js" type="module"></script>
</body>
```

#### IMPORTANT: NB And PSW

`type="module"` respects CORS, so make sure that `PATH_TO_STATIC_CONTENT` is a root-relative url that **excludes** the host name **if your content is on a different host**.

When loading angular apps using differential-loading, **you must use root-relative urls** and MUST NOT INCLUDE THE HOST in the `src` attribute. Including the host will cause CORS errors in FIN/FAC and mobile prod, causing your page not to load!

Many NB teams have used NB_STATIC_CONTENT_HOST in the past within their script `src`. This WILL NOT WORK for `type="module"` because it includes the hardcoded host. WI-WEB has instructed us to always use root-relative as they will not be updating their CORS policy.

##### Example: Client-side root-relative URLs

```html
<!-- BAD - includes hardcoded host -->
<script src="https://workplaceservices.fidelity.com/static/mybenefits/YourClientAppContent/main.js" type="module"></script>
 <!-- BAD - navproperties.NB_STATIC_CONTENT_HOST includes host -->
<script src="${​​​​​​​​navproperties['NB_STATIC_CONTENT_HOST']}​​​​​​​​/static/mybenefits/YourClientAppContent/main.js" type="module"></script>
<!-- GOOD - root-relative and does not include host -->
<script src="/static/mybenefits/YourClientAppContent/main.js" type="module"></script>
```

## Webpack bundle analyzer

Use webpack bundle analyzer to visualize where code in the final webpack bundles comes from. This helps you identify where you can further optimize your bundles.

```bash
    npm run report
```

## Source map explorer

Source-map-explorer takes a bundle .js file with its generated source maps, and turns them into a tree map. This visualization makes it easy to identify what code is being loaded in each bundle.

```bash
    npm run report:source-map
```

## Upgrades and maintenance

* Go to [Codex | Migration Guides](https://codex.fmr.com/#/tools/seed-products/application/migration-guides) for guides on migrating to the latest seed app

## Autoprefixer

Grid support is disabled by default by Autoprefixer. To enable grid support add below to the top of all scss files that are using grid.

``` scss
    /*! autoprefixer grid: autoplace */
```

## Help and Support

To get more help on the Angular CLI, use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

* [Codex](https://codex.fmr.com/#/)
* [Codex | Get Support](https://codex.fmr.com/#/get-support/overview)
* [Seed App Examples Repo](https://github.com/Fidelity-Red/ap123285-seed-client-app-with-examples)
