'use strict'
const express = require('express');
const app = express();
const routes = require('./auth/router');


app.use(express.json());
app.use(routes);

module.exports = {
    server: app,
    start: port =>{
        const PORT = port || process.env.PORT || 3000;
        app.listen(PORT, ()=> console.log(`listening on ${PORT}`));
    }
}