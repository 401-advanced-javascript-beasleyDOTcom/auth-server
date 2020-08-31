'use strict'
module.exports = (capability) =>{

    return (request, response, next) =>{
        console.log('this is request.user in acl.js line 5', request.user)
        try{
            if(request.user.capabilities.includes(capability)){
                next();
            }
        
            else{
                next('Access Denied');
            }
        } catch(error){
            next('Invalid Login');
        }

    };


}