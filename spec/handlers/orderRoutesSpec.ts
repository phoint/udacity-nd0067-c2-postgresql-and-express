import supertest from 'supertest';
import app from '../../src/server';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

const request = supertest(app)
configDotenv()

describe('Order routes', () => {
    let jwtToken: string;
    beforeAll((done) => {
        request
            .post('/authenticate')
            .send({ "username": "johnDoe", "password": "password123" })
            .expect(200)
            .end((err, res) => {
                jwtToken = res.body
                done()
            })
    })

    it('GET /orders OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/orders')
            .auth(jwtToken, {type: "bearer"})
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual([{
                    id: 1,
                    userId: 1,
                    status: "completed",
                    products: [{
                        product: "1",
                        quantity: 3
                    }]
                }]);
                done();
            });
    });
    it('GET /orders/:id OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/orders/1')
            .auth(jwtToken, {type: "bearer"})
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual({
                    id: 1,
                    userId: 1,
                    status: "completed",
                    products: [{
                        product: "1",
                        quantity: 3
                    }]
                });
                done();
            });
    });

    it('POST /orders should create a order', (done) => {
        spyOn(console,'log')
        request
            .post('/orders')
            .auth(jwtToken, {type:"bearer"})
            .send({
                "userId": 2,
                "status": "active"
            })
            .expect(200)
            .end((err, res) => {
                if (err){
                    console.log("Testing error")
                    done();
                }
                expect(res.body).toEqual({
                    id: 2,
                    userId: 2,
                    status: 'active'
                })
                done();
            });
    });

    it('POST /orders/:id/products OK', (done) => {
        spyOn(console,'log')
        request
            .post('/orders/2/products')
            .auth(jwtToken, {type: "bearer"})
            .send({
                "productId": "2",
                "quantity": 5
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual({
                    id: 2,
                    userId: 2,
                    status: "active",
                    products: [{
                        product: "2",
                        quantity: 5
                    }]
                });
                done();
            });
    });

    it('PUT /orders/:id OK', (done) => {
        spyOn(console,'log')
        request
            .put('/orders/2')
            .auth(jwtToken, {type: "bearer"})
            .send({
                "userId": 2,
                "status": "completed"
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual({
                    id: 2,
                    userId: 2,
                    status: "completed",
                    products: []
                });
                done();
            });
    });

    it('GET /orders/users/:userId OK', (done) => {
        spyOn(console, 'log')
        request
            .get('/orders/users/2')
            .auth(jwtToken, {type: "bearer"})
            .expect(200)
            .end((err, res) => {
                expect(res.body).toEqual([{
                    id: 2,
                    userId: 2,
                    status: "completed",
                    products: []
                }]);
                done();
            });
    });
});

