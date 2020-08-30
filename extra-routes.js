const express = require('express');
const bearerMiddleware = require('./src/auth/middleware/bearer.js')
const permissions = require('./src/auth/middleware/acl.js');
const router = express.Router();

router.get('/public', routeHandler);
router.get('/private', bearerMiddleware, routeHandler);
router.get('/readonly', bearerMiddleware, permissions('read'), routeHandler);
router.post('/create', bearerMiddleware, permissions('create'), routeHandler);
router.put('/update', bearerMiddleware, permissions('update'), routeHandler);
router.delete('/delete', bearerMiddleware, permissions('delete'), routeHandler);

function routeHandler (request, response){
    response.status(200).send('Axe-Chess Grand-Ted');
}
module.exports = router;