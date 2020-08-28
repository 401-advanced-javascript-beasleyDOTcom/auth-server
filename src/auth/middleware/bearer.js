'use strict';
const User = require("../models/users-model");

module.exports = async function (request, response, next){
    if (!request.headers.authorization) {
        next('Invalid Login: missing headers'); return;
    };

    let token = request.headers.authorization.split(' ').pop();    
    try{
        const validUser = await User.authenticateToken(token);

        request.user = validUser;
        next();
    } catch(ERROR){
        next('Invalid Login');
    }
};