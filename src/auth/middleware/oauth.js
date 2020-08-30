'use strict';
const superagent = require('superagent');
const User = require('../models/users-model');

const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const CLIENT_ID = 'c08c78457a1e5f418dd8';
const CLIENT_SECRET = '55474584322507ab26aa07e11000dd96cfa24cf9';
const API_SERVER = 'http://localhost:3003/oauth';

module.exports = async function authorize(request, response, next){

    try{
        let code = request.query.code;
        console.log('(1) CODE:', code);

        let remoteToken = await exchangeCodeForToken(code);
        console.log('(2) ACCESS TOKEN', remoteToken);

        let remoteUser = await getRemoteUserInfo(remoteToken);
        console.log('(3) GITHUB USER', remoteUser);

        let [user, token] = await getUser(remoteUser);
        request.user = user;
        request.token = token;
        console.log('(4) LOCAL USSR', user);

        next();
    } catch(error){next(`Error: line 29 ${error.message}`)};
        //end of module.exports
}

    async function exchangeCodeForToken(code){
        console.log('client_id', CLIENT_ID, 'client_secret',   CLIENT_SECRET, API_SERVER)
       try{
            let tokenResponse = await superagent.post(tokenServerUrl).send({
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: API_SERVER,
            grant_type: 'authorization_code',
        });
        
        let access_token = tokenResponse.body.access_token;
        return access_token; } catch(error){
            console.error('UNABLE TO EXCHANGE CODE FOR TOKEN');
        }
    };

    async function getRemoteUserInfo(token){
        let userResponse = 
            await superagent.get(remoteAPI)
                .set('user-agent', 'express-app')
                .set('Authorization', `token ${token}`);
        let user = userResponse.body;
        return user;
    };

    async function getUser(remoteUser){

        let user = await User.createFromOauth(remoteUser.login);
        let token = user.generateToken();

        return [user, token];
    };