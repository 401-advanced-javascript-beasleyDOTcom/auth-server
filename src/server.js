'use strict'
const express = require('express');
const app = express();
const routes = require('./auth/router');
const path = require('path');
const test = require('../extra-routes.js');

app.use(express.static('./public'));
app.use(express.json());
app.use(routes);
app.use(test);

module.exports = {
    server: app,
    start: port =>{
        const PORT = port || process.env.PORT || 3000;
        app.listen(PORT, ()=> console.log(`listening on ${PORT}`));
    }
}