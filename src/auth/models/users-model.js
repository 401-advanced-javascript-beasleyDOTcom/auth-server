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

users.statics.authenticateBasic = function (username, password){
    let query = { username};
    return this.findOne(query)
        .then(user => {
            user && user.comparePassword(password);

        })
            .catch((error) =>{
                console.error('8888888something bad8888888888888888')
            });
};
// not statics but methods
users.methods.generateToken = function (){
    let token = jwt.sign({username:this.username}, process.env.SECRET)
    return token;
}
users.methods.comparePassword = function (plainPassword){
    //methods because it is for this particular user not any user like static would apply to
    return bcrypt.compare(plainPassword, this.password).then(valid => valid ? this : null)
}


module.exports = mongoose.model('users', users);