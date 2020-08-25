'use strict'
// cookie and token.. send back token
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const users = require('../models/users-model.js');



module.exports = (request, response, next) =>{
if (!request.headers.authorization){ next('Invalid Login'); return;}

let basic = request.headers.authorization.split(' ').pop();

let [user, pass] = base64.decode(basic).split(':');

users.authenticateBasic(user, pass)
    .then(validUser =>{
        request.token = users.generateToken(validUser);
        next();
    }).catch(err => next('Invalid Login'));
}