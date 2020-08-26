'use strict'
// cookie and token.. send back token
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const Users = require('../models/users-model.js');



module.exports = async (request, response, next) =>{
    console.log(request.headers, '=======================headers')
if (!request.headers.authorization){ next('error in if because there are no request.headers.authorization'); return;}

// basic lskdl:lksdfl
let basic = request.headers.authorization.split(' ').pop();

let [user, pass] = base64.decode(basic).split(':');
console.log('========user', user, '================pass', pass)
const validUser = await Users.authenticateBasic(user,pass);
request.token=Users.generateToken(validUser);
request.user=user;
next();
 
    next({'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'});

}

// return Users.authenticateBasic(user, pass)
//     .then(validUser)
//     function validUser(user){
//         if(user){
//             request.user = user;
//             request.token= user.generateToken();
//             next();
//         }
//         else{
//             next({'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'});
//         }
//     }
// }