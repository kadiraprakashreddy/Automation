// Matches error codes < 200 & > 299
const ERROR_CODE_REGEX = new RegExp(/(?!([2][0-9][0-9]))\d{3}/);
const JSON_REGEX = new RegExp(/.json$/);

// this middleware assists in mocking service error responses
module.exports = function(req, res, next) {
    if (isJsonFile(req)) {
        const statusCode = getStatusCode(req);
        if (isErrorCode(statusCode)) {
            res.append('fid-ws-http-status', statusCode);
        }
    }
    next();
};

// extracts the 3 digit status code from the requested file name
function getStatusCode(req) {
    return req.url.split('/').pop().split('-').pop().slice(0, 3);
}

function isErrorCode(statusCode) {
    return ERROR_CODE_REGEX.test(statusCode);
}

function isJsonFile(req) {
    return JSON_REGEX.test(req.path);
}