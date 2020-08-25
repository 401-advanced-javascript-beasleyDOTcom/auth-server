'use strict'
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
    username:{ type : String, required: true, unique: true},
    password: { type : String, required: true},
    email: { type: String},
    fullname:{ type : String},
    role:{ type : String, required: true, default: 'user', enum: ['admin', 'editor','writer','user']}
})
// how to modify user instance
users.pre('save', async function (){
    // we need to go to a function to hash password before we send it to the database
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
    }
})

users.statics.authenticateBasic = function (username, password){
    let query = { username};
    return this.findOne(query)
        .then(user => user && user.comparePassword(password))
            .catch(console.error);
};
// not statics but methods
users.methods.generateToken = function (){
    let token = jwt.sign({username:user.username}, process.env.SECRET)
    return token;
}
users.methods.comparePassword = function (plainPassword){
    //methods because it is for this particular user not any user like static would apply to
    return bcrypt.compare(plainPassword, this.password).then(valid => valid ? this : null)
}


module.exports = mongoose.model('users', users);