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

        request.user = {
            username: validUser.username,
            fullname: validUser.fullname,
            email: validUser.email,
            // capabilities:['REPLACE THIS ARRAY WITH WHAT YOU NEED'],
            capabilities: validUser.capabilities,
        };
        next();
    } catch(ERROR){
        next('Invalid Login');
    }
};