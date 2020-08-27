'use strict'
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
    username:{ type : String, unique: true},
    password: { type : String},
    email: { type: String},
    fullname:{ type : String},
    role:{ type : String, default: 'user', enum: ['admin', 'editor','writer','user']}
})
// how to modify user instance
users.pre('save', async function (){
    console.log('inside of presave asyn function==============')
    // we need to go to a function to hash password before we send it to the database
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5);
    }
})

users.statics.authenticateBasic = async function (username, password){
    const user = await this.findOne({ username});
    return user && await user.comparePassword(password);

};

users.methods.comparePassword = async function (plainPassword){
    const passwordMatch = await bcrypt.compare(plainPassword, this.password);
    return passwordMatch ? this : null;

};

// not statics but methods
users.methods.generateToken = function (){
    const payload = {
        username: this.username,
        id: this._id,
        role: this.role,
      }
    let token = jwt.sign(payload, 'anInconvenientTruthRythm');
    return token;
}

users.statics.createFromOauth = async function (email){
    const user = await this.findOne({email});
    // if email is not valid
    if(!email){
        return Promise.reject('Validation Error');
    }
    
    //how to tell that a brand new user is NOT found
    if(user){
        return user;
    }
    else{      //built in create and save method of mongoose
        //otherwise return new User({...}).save()
        return this.create({username: email, password: 'none', email: email})
    }
}
module.exports = mongoose.model('users', users);