const request = require('supertest');
const app = require('../../app');
const { createJwtToken } = require('../helper');
const mockingoose = require('mockingoose').default;
const User = require('../../models/user');
let auth = {};

describe('Test GET /status', () => {

    test('...', () => {});

    // beforeAll(async () => {
    //     auth.token = createJwtToken();
    // });
    //
    // test('It should return 401 if not authorized', (done) => {
    //     request(app).get('/kyc').then((response) => {
    //         expect(response.statusCode).toBe(401);
    //         done();
    //     });
    // });
    //
    // test('It should response the GET method', async (done) => {
    //
    //     mockingoose(User).toReturn({}, 'getKycAccountById');
    //
    //     const response = await request(app)
    //         .get('/kyc')
    //         // add an authorization header with the token
    //         .set("authorization", auth.token);
    //     expect(response.statusCode).toBe(200);
    //     done();
    // });
});