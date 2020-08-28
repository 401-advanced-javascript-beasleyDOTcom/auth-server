'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./auth/router');
const path = require('path');
const test = require('../extra-routes.js');
const notFound = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');

const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);
app.use(test);

app.use(notFound);
app.use(errorHandler);

module.exports = {
    server: app,
    start: port =>{
        const PORT = port || process.env.PORT || 3000;
        app.listen(PORT, ()=> console.log(`listening on ${PORT}`));
    }
}