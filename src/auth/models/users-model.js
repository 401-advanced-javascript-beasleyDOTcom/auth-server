'use strict'
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
console.log(process.env.JWT_SECRET, 'process thingy line 6');

const users = new mongoose.Schema({
    username:{ type : String, required: true, unique: true},
    password: { type : String, required: true},
    email: { type: String},
    role:{ type : String, default: 'user', enum: ['admin', 'editor','writer','user']}
})
// how to modify user instance
users.pre('save', async function (){
    // we need to go to a function to hash password before we send it to the database
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5);
    }
});

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
      let options = {};
      console.log('line 42', payload, SECRET, options)
    return jwt.sign(payload, SECRET, options);
}

users.statics.authenticateToken = async function (token){
    console.log('line 46', token)
    let tokenObject = jwt.verify(token, SECRET);
    const foundUser = await users.findById(tokenObject.id);

    if(foundUser){
        return foundUser;
    }
    else{
        throw new Error('User not found! sorry...')
    } 
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
            return this.create({username, password});
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