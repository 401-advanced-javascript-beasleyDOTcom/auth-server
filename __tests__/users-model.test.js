'use strict'
require('dotenv').config();
require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const User = require('../src/auth/models/users-model.js');
afterEach(async () => {
    await User.deleteMany({});
});

const fakeUser = {
    username: 'janedoe',
    password: 'password',
    role: 'admin',
    email: 'jane@doe.com',
};

it('should save hashed password', async () => {
    const user = await new User(fakeUser).save();
    expect(user.username).toBe(fakeUser.username);
    expect(user.password).not.toBe(fakeUser.password);
});

it('should authenticate known user', async () => {
    await new User(fakeUser).save();
    const authenticatedUser = await User.authenticateBasic(fakeUser.username, fakeUser.password);
    expect(authenticatedUser).toBeDefined();
});
it('should authenticate known user', async () => {
    await new User(fakeUser).save();
    const authenticatedUser = await User.authenticateBasic('nobody', 'unknown');
    expect(authenticatedUser).toBeNull();
});

it('should return user when password is matched', async () => {
    const user = await new User(fakeUser).save();
    const comparedUser = await user.comparePassword(fakeUser.password);
    expect(comparedUser).toBe(comparedUser);
});

it('should return null when password is bad', async () => {
    const user = await new User(fakeUser).save();
    const comparedUser = await user.comparePassword('whyISoTiredRightNow');
    expect(comparedUser).toBeNull();
});

it('should generate a token', async () => {
    const user = await new User(fakeUser).save();
    const token = user.generateToken();
    expect(token).toBeDefined();

});

it('creating an existing user returns that same user', async () => {
    const user = await new User(fakeUser).save();
    const foundOrCreated = await User.createFromOauth(user.email);

    expect(foundOrCreated.email).toBe(user.email);
    expect(foundOrCreated.password).toBe(user.password);
});

it('creating with email returns new user if not present', async () => {
    const foundOrCreated = await User.createFromOauth('beasley.comAtgmail@gmail.com');
    expect(foundOrCreated.email).toBe('beasley.comAtgmail@gmail.com');
    expect(foundOrCreated.password).not.toBe('none');
    expect(foundOrCreated.username).toBe('beasley.comAtgmail@gmail.com');
});

it('creating with null for email throws an error', async () => {
    expect.assertions(1);
    await expect(User.createFromOauth(null)).rejects.toEqual('Validation Error');
});

