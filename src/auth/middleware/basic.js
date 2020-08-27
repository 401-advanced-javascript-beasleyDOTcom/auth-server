'use strict'
// cookie and token.. send back token
const base64 = require('base-64');
const bcrypt = require('bcrypt');
const Users = require('../models/users-model.js');



module.exports = async (request, response, next) =>{
    console.log(request.headers, '=======================headers')
if (!request.headers.authorization){ next({'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'}); return;}

// basic lskdl:lksdfl
let basic = request.headers.authorization.split(' ').pop();

let [user, pass] = base64.decode(basic).split(':');
try{
const validUser = await Users.authenticateBasic(user,pass);
let token = await validUser.generateToken();
request.token= token;
request.user=user;
next();
} catch { next({'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'})}

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