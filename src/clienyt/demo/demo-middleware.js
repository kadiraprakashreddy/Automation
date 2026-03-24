const fs = require('fs');
const path = require('path');
const HTML_REGEX = new RegExp(/.html$/);
// ignore certain html files
const IGNORE_LIST = [
    '/index.html'
];
generateScript = (src) => {
    const script = `<script src="${src}"></script>`;
    return script;
}
generateStyleSheet = (href) => {
    const link = `<link href="${href}" rel="stylesheet" type="text/css"/>`;
    return link;
}
addScriptsToPage = (req, cb) => {
    // all things shoudl be coming from angular dev server on 4200
    const serverPath = `${req.protocol}://${req.hostname}:4200/`;
    const endHeadTag = '</head>';
    //adding custom injection point for script
    const endBodyTag = '<!--INJECT_ALL_SCRIPTS-->'
    const scripts = [
        generateScript(serverPath + 'runtime.js'),
        generateScript(serverPath + 'polyfills.js'),
        generateScript(serverPath + 'scripts.js'),
        generateScript(serverPath + 'vendor.js'),
        generateScript(serverPath + 'main.js'),
        // this is only needed when doing an local dev build through ```npm run dev``` or ```npm run dev:es5```
        generateScript(serverPath + 'styles.js')
    ];
    const links = [
        // this is only needed when doing an local prod build through ```npm run dev:aot```
        generateStyleSheet(serverPath + 'styles.css')
    ];
    // use req.path in case a demo url has query string parameters
    fs.readFile(path.join(__dirname, req.path), 'utf8', (err, data) => {
        // simple error handling
        if(err){
            return cb(err, null);
        }
        let replaceStringsHead = links.join('');
        let replaceStringsBody = scripts.join('');
        const newHtml = data
            // add all scripts to head then re add ending </head>
            .replace(endHeadTag,`${replaceStringsHead}${endHeadTag}`)
            // add all scripts to end of body then re add ending </body>
            .replace(endBodyTag,`${replaceStringsBody}${endBodyTag}`);
        cb(newHtml);
    });
}
// all html needs to dynamically have our angular scripts/links
module.exports = function (req, res, next) {
    // use req.path in case a demo url has query string parameters
    if(HTML_REGEX.test(req.path) && !IGNORE_LIST.includes(req.path)){
        addScriptsToPage(req,(err, data) => {
            // simply reflect error or data for help with debugging
            data = (data) ? data : err;
            return res.send(data);
        });
    }else {
        next();
    }
};
