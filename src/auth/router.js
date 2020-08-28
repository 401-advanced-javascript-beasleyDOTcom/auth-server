'use strict'
const express = require('express');
const router = express.Router();

const User = require('./models/users-model');
const auth = require('./middleware/basic');
const oauthMiddleware = require('./middleware/oauth.js');
const bearer = require('./middleware/bearer');



router.post('/signup', async (request, response, next)=>{
    const user = await User.create(request.body);
    const token = user.generateToken();
    const responseBody = {
        token, 
        user,
    };
    response.status(201).send(responseBody);
})
// auth goes to oauth.js where it evaluates
router.post('/signin', auth, (request, response, next) =>{
response.cookie('auth', request.token);
response.set('token', request.token);
response.status(200).json({
    token: request.token,
    user: request.user,
});
});
router.get('/users', bearer , async (request, response, next) =>{
    let users = await User.find({});
    // console.log(cait,'================')
    response.status(200).json(users)
    next();
})

router.get('/oauth', oauthMiddleware, (request, response, next) =>{
response.status(200).send(request.token);
})


module.exports = router;