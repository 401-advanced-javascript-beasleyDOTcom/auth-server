const express = require('express');
const bearerMiddleware = require('./src/auth/middleware/bearer.js')
const router = express.Router();
// const app = express();

router.get('/secret',  (request, response, next) =>{
    console.log("you've found the secret!")
})
module.exports = router;