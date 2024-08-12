import supertest from 'supertest';
import app from '../../src/server';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

const request = supertest(app)
configDotenv()

describe('Product routes', () => {
    let jwtToken: string;
    beforeEach((done) => {
        request
            .post('/authenticate')
            .send({ "username": "johnDoe", "password": "password123" })
            .expect(200)
            .end((err, res) => {
                jwtToken = res.body
                done()
            })
    })

    it('GET /products OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/products')
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual([{
                    id: 1,
                    name: "test product",
                    price: 25
                }]);
                done();
            });
    });
    it('GET /products/:id OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/products/1')
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual({
                    id: 1,
                    name: "test product",
                    price: 25
                });
                done();
            });
    });

    it('POST /products should create a product', (done) => {
        spyOn(console, 'log')
        request
            .post('/products')
            .auth(jwtToken, { type: "bearer" })
            .send({
                "name": 'test product 2',
                "price": 35,
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual({
                    id: 2,
                    name: "test product 2",
                    price: 35
                })
                done();
            });
    });

    it('GET /popular-product OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/popular-product?top=2')
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual([{
                    name: "test product",
                    count: "1"
                }]);
                done();
            });
    });
});

