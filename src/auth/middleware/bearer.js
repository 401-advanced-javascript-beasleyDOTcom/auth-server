'use strict';
const usersModel = require("../models/users-model");

module.exports = async function (request, response, next){
    if (!request.headers.authorization) {
        next('Invalid Login: missing headers'); return;
    };
    let token = request.headers.authorization.split(' ').pop();    
    
    usersModel.authenticateToken(token)
        .then(validUser =>{
            request.user = validUser;
            next();
        })
            .catch(next('Invalid Login'));
}