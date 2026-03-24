/*
    This an express demo server that is useful for serving multiple local demos for the client app.
*/
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const demoMiddleware = require('./demo-middleware');
const app = express();
// angular cli port + 1
const port = 4201;

// Sets the fid-ws-http-status to 500 for receiving a 500 from the help and learning api call
app.get('*/api/error/error500.json', function (req, res, next) {
    res.set('fid-ws-http-status', 500)
    return next();
});

// Sets the fid-ws-http-status to 500 for receiving a 500 from the help and learning api call
app.get('*/api/error/error500distributions.json', function (req, res, next) {
    res.set('fid-ws-http-status', 500)
    return next();
});

// Sets the fid-ws-http-status to 403 for receiving a 403 from the help and learning api call
app.get('*/api/error/error403.json', function (req, res, next) {
    res.set('fid-ws-http-status', 403)
    return next();
});

// Sets the fid-ws-http-status to 404 for receiving a 404 from the help and learning api call
app.get('*/api/error/error404.json', function (req, res, next) {
    res.set('fid-ws-http-status', 404)
    return next();
});

app.get('*/api/error/*', function(req, res, next){

    var endIndex = req.url.lastIndexOf('/error');
    var ref =  req.header('Referrer');

    if(ref.indexOf('errorCd=400') > -1)
    {
      req.url=req.url.substring(0,endIndex)+ '/error400.json';
      res.set('fid-ws-http-status', 400)
    }
    else if(ref.indexOf('errorCd=403') > -1)
    {
      req.url=req.url.substring(0,endIndex)+ '/error403.json';
      res.set('fid-ws-http-status', 403)
    }
    else if(ref.indexOf('errorCd=500') > -1)
    {
      req.url=req.url.substring(0,endIndex)+ '/error500.json';
      console.log(req.url);
      res.set('fid-ws-http-status', 500)
    }
    else if(ref.indexOf('errorCd=404') > -1)
    {
      req.url=req.url.substring(0,endIndex)+ '/error404.json';
      res.set('fid-ws-http-status', 404)
    }
    return next();
});
const demoErrorMiddleware = require('./demo-error-middleware');

// this assists in mocking service error responses
app.use(demoErrorMiddleware);

// make sure we add scripts to our html
app.use(demoMiddleware);
// serve assets statically
app.use(express.static(path.join(__dirname, '.')));

// redirect to index page
app.get(['/', '/index','/index.html'], function(req, res){
    res.redirect('/pages');
});

// Catch all NON-GET requests and redirect them, this converts them to a GET
// This is useful so teams can keep app code the same (httpClient.post,httpClient.put, etc ) but still return mock json files
app.route(/.*/)
.post((req,res) => {
    res.redirect(req.url);
}).put((req,res) => {
    // https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put
    res.redirect(303, req.url);
}).delete((req,res) => {
    res.redirect(303, req.url);
});
// TODO figure out if we need this
// piggyback on webpack-dev-servers self generated certs
/* const options = {
    key: fs.readFileSync(path.join(__dirname, '../node_modules/webpack-dev-server/ssl/server.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../node_modules/webpack-dev-server/ssl/server.pem')),
};
https.createServer(options, app).listen(port, () => console.log(`Demo server listening on port ${port}!`)); */
app.listen(port, () => console.log(`Demo server listening on port ${port}!`));
