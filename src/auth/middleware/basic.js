'use strict'
// cookie and token.. send back token
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const User = require('../models/users-model.js');



module.exports = async (request, response, next) =>{

    const errorObj = { status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'};    
if (!request.headers.authorization){ next(errorObj); return;}

// basic lskdl:lksdfl
let encodedPair = request.headers.authorization.split(' ').pop();

let [user, pass] = base64.decode(encodedPair).split(':');
try{
const validUser = await User.authenticateBasic(user,pass);
request.token = validUser.generateToken();

request.user=user;
next();
} catch { next(errorObj)};

}
 
    // next({'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'});
    // return Users.authenticateBasic(user, pass)
    //     .then( function (){
    //         user => {
    //             if(user){
    //                 request.user = user;
    //                 request.token = user.generateToken();
    //                 next();
    //             }
    //             else{
    //                 next(new Error('Invalid'))
    //             }
    //         }
    //     })
    // }
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