'use strict'
module.exports = (err, request, response, next) =>{
console.error('__SERVER_ERROR__', err);
let error = { error: err.message || err};
response.statusCode = err.status || 500;
response.statusMessage = err.statusMessage || 'Server Error';
response.setHeader('Content-type', 'application/json');
response.write(JSON.stringify(error));
response.end();
}