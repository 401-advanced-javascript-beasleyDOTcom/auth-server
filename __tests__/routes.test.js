'use strict';

let SECRET = 'anInconvenientTruthRythm';

const jwt = require('jsonwebtoken');

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');




describe('Auth Router', () => {

  describe(`users signup/in`, () => {

    it.skip('can sign up', async () => {
      const mockRequest = supergoose(server);

      const userData = { username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com' };

      const results = await mockRequest.post('/signup').send(userData);

      const token = await jwt.verify(results.text, 'anInconvenientTruthRythm');

      expect(token.id).toBeDefined();

    });

    it('can signin with basic', async () => {
      const mockRequest = supergoose(server);
      const userData = { username: 'joey', password: 'password', role: 'admin', email: 'admin@admin.com' };

      await mockRequest.post('/signup').send(userData);

      const results = await mockRequest.post('/signin').auth('joey', 'password');
console.log(results.body,'reslults.test llllllllllllllllllll')
      const token = jwt.verify(results.body.token, SECRET);

      expect(token).toBeDefined();

    });

  });


});