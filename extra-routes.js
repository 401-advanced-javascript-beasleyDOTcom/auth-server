const express = require('express');
const bearerMiddleware = require('./src/auth/middleware/bearer.js')
const router = express.Router();
// const app = express();

router.get('/secret', bearerMiddleware, (request, response, next) =>{
    console.log("you've found the secret!")
    response.status(200).send('access allowed');
    next();
})
module.exports = router;