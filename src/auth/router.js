'use strict'
const express = require('express');
const router = express.Router();

const auth = require('./middleware/basic');
const usersModel = require('./models/users-model');


router.post('/signup', (request, response, next)=>{
    const user = new usersModel(request.body);
    user.save()
        .then(userr => response.status(201)
        .send('we saved you'))
            .catch(next);
})
// auth goes to oauth.js where it evaluates
router.post('/signin', auth, (request, response, next) =>{
// cookie and token.. send back token
// response.cookie('auth', request.token);
// response.send(request.token);
// next();
response.status(200).json({token: request.token})

/*
    response.send({
        token: request.token,
    user: request.user,
})
*/
})
router.get('/users', async (request, response, next) =>{
    let cait = await usersModel.find({});
    console.log(cait,'================')
    response.status(200).json(cait)
    next();
})

module.exports = router;