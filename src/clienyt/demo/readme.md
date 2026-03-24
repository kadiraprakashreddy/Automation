# Demo Server 
The seed client app contains 2 servers: webpack dev server from angular cli and an express static content server.
- webpack-dev-server runs on port 4200
- demo server runs on port 4201

## Overview
### ```api/``` folder
  - contains all .js and .json
  - intended to serve mock json responses along with hosting pageData.js
### ```bin-public/``` folder
  - can put images that live in /bin-public  SDL Tridion during development
### ```pages/``` folder
  - contains all demo html files
  - intended to house multiple deep-linkable demo pages to showcase all data scenarios
  - ```index.html``` is landing page you can add your demos as links here
### ```styles/``` folder
  - contains styles needed to facilitate demos mainly ```fonts.css``` which provides fidelity sans to local demo pages
  - teams rarely need to go in here
### ```templates/``` folder
  - contains page templates for both NB and PSW
  - When making a new demo you can copy the template you need and put it inside ```pages/``` along with it's data scenario inside ```api/```
### ``` demo-middleware.js```
  - node middleware that adds all the necessary scripts to any demo html files.
  - dynamically adds all js/css needed from the angular dev server running on :4200
  - teams will rarely need to go in here
### ```demo-server.js```
- This is the express server used to serve static content and rest responses.

## How to Create a New Demo Page
1) Get template you need from ```templates/``` and paste into folder inside ```pages/your-demo/demo.html```
2) add a ```api/your-demo/pageData.js``` and any mock api .json ```api/your-demo/data-scenerio.json``` 
3) ensure that the new html demo links to the ```/api/your-demo/pageData.js``` if needed ```<script src=""/api/your-demo/pageData.js"></cript>```
4) update ```pages/index.html``` with a reference to your new demo```<a href="/pages/your-demo/demo.html">your demo</a>```
5) ensure your ```environment.ts``` is setup correctly to point at the data inside ```pageData.js``` in order to get urls for your mock data.
6) (optional) If you are using lazy loaded modules make sure you update your ```main.ts``` according to the steps inside ```README.md```