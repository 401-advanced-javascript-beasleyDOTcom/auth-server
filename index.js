'use strict'
require('dotenv').config();
const server = require('./src/server');
const mongoose = require('mongoose');


const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(process.env.MONGODB, mongooseOptions, ()=>{
    server.start();
}).catch(() => console.log('connect is not working?'));


