'use strict'
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const SINGLE_USE_TOKENS = false; // or add this using process.env.singluse tokns etc.
const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '60m';

const usedTokens = new Set();

const users = new mongoose.Schema({
    username:{ type : String, required: true, unique: true},
    password: { type : String, required: true},
    fullname:{ type : String },
    email: { type: String},
    role:{ type : String, default: 'user', enum: ['admin', 'editor','writer','user']},
    capabilities: { type: Array, required: true, default: []},
})
// how to modify user instance
users.pre('save', async function (){
    // we need to go to a function to hash password before we send it to the database
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5);
    }
    
    let role = this.role; //tweak this to try out your different roles
    // let role = 'editor';

    if(this.isModified('role')){
        
        switch(role){
            case 'admin':
                this.capabilities = ['create', 'read', 'update', 'delete'];
                break;
            case 'editor':
                this.capabilities = ['create', 'read', 'update'];
                break;
            case 'writer':
                this.capabilities = ['create', 'read'];
                break;
            case 'user':
                this.capabilities = ['read'];
                break;
        }
    }


});

users.statics.authenticateBasic = async function (username, password){
    try{
        const user = await this.findOne({ username});
        return user && await user.comparePassword(password);
    } catch(error){
        throw new Error("You've encountered an Error", error);
    };
    
};

users.methods.comparePassword = async function (plainPassword){
    try{
        const passwordMatch = await bcrypt.compare(plainPassword, this.password);
        return passwordMatch ? this : null;    
    } catch(error){
        throw new Error('Unable to compare password', error);
    };
};

// not statics but methods
users.methods.generateToken = function (type){
    let token = {
        id: this._id,
        role: this.role,
        capabilities: this.capabilities,
      };
      //additional security measures below
    let options = {};
    if(type !== 'key' && !!TOKEN_EXPIRE){
        options = { expiresIn: TOKEN_EXPIRE };
    }

    return jwt.sign(token, SECRET, options);
}

users.methods.generateKey = function (){
    return this.generateToken('key');
};

users.statics.authenticateToken = async function (token){
    if(usedTokens.has(token)){
        console.log('unique fail');
        return Promise.reject('Invalid Token');
    }
    try{
        let tokenObject = jwt.verify(token, SECRET);

        (SINGLE_USE_TOKENS) && tokenObject.type !== 'key' && usedTokens.add(token);
        let query = { _id: tokenObject.id };
        return this.findOne(query)
        // const foundUser = await this.findById(tokenObject.id);
        // if(foundUser){
        //     return foundUser;
        // }
        // else{
        //     throw new Error('User not found! sorry...')
        // } 
    } catch(error){ throw new Error('Invalid Token'); }
   


} 

users.statics.createFromOauth = function (username){

    if(!username){
        return Promise.reject('Validation Error');
    }
    return this.findOne({username})
        .then(user =>{
            if(!user){ throw new Error('User Not Found');}

            console.log('Welcome Back!', user.username);
            return user;
        }).catch( error =>{
            console.log('Creating new user');
            let password = 'goodTimesGreatPizza';
            let role = 'writer'; // CHANGE THIS ROLE TO TEST OUT DIFFERENT ROUTES
            return this.create({username, password, role});
        })


    //how to tell that a brand new user is NOT found
    // if(user){
    //     return user;
    // }
    // else{      //built in create and save method of mongoose
    //     //otherwise return new User({...}).save()
    //     return this.create({username: email, password: 'none', email: email})
    // }
}
module.exports = mongoose.model('users', users);