import supertest from 'supertest';
import app from '../../src/server';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

const request = supertest(app)
configDotenv()

describe('User routes', () => {
    let jwtToken: string;
    it('POST /authenticate OK', (done) => {
        spyOn(console, 'log')
        request
            .post('/authenticate')
            .send({ "username": "johnDoe", "password": "password123" })
            .expect(200)
            .end((err, res) => {
                expect(res.body).toBeTruthy
                jwtToken = res.body
                done()
            })
    })

    it('GET /users OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/users')
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual([{
                    id: 1,
                    username: 'johnDoe',
                }]);
                done();
            });
    });
    it('GET /users/:id OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/users/1')
            .auth(jwtToken, { type: "bearer" })
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual({
                    id: 1,
                    username: 'johnDoe',
                });
                done();
            });
    });

    it('POST /users should create a user', (done) => {
        spyOn(console, 'log')
        request
            .post('/users')
            .auth(jwtToken, { type: "bearer" })
            .send({
                "username": "johnDoe_2",
                "password": "password123"
            })
            .expect(200)
            .end((err, res) => {
                const payload: Object = jwt.verify(res.body, process.env.TOKEN_SECRET as string)
                expect(payload.hasOwnProperty("username")).toBeTrue()
                done();
            });
    });
});

