'use strict'
const express = require('express');
const router = express.Router();

const auth = require('./middleware/basic');
const usersModel = require('./models/users-model');

router.post('/signup', (request, response, next)=>{
    usersModel.save(request.body)
        .then(user => response.status(201).send('We have fulfilled your request.. object'))
            .catch(next('Sorry... we were unable to save you!!!!'));
        // .then(user =>{
        //     let token = users.generateToken(user);
        //     response.status(201).send('You have ');
        // })
})
// auth goes to oauth.js where it evaluates
router.post('/signin', auth, (request, response, next) =>{
// cookie and token.. send back token
response.cookie('auth', request.token);
response.send(request.token);

/*
    response.send({
        token: request.token,
    user: request.user,
})
*/
})

module.exports = router;