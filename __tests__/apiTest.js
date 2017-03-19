import request from 'supertest'
import nconf from 'nconf'

import app from '../src/index'

describe('Test the API server', () => {

    const apiUrl = nconf.get('api:path')

    afterAll(() => {
        // shotdown server after the tests
        app.close()
    })

    // test the GET /api/<version>/users/ route
    it('should return an array of users', (done) => {
        return request(app)
        .get(apiUrl + 'users/')
        .expect(200)
        .then(res => {
            // check that it sends back an array
            expect(res.body).toBeInstanceOf(Array)
            done()
        })
    })

    // test the GET /api/<version>/users/1 route
    it('should return an user object', (done) => {
        return request(app)
        .get(apiUrl + 'users/1')
        .expect(200)
        .then(res => {
            // check that it sends back an array
            expect(res.body).toBeInstanceOf(Object)
            done()
        })
    })

    // test the POST /api/<version>/users/ route
    it('should add a new user object', (done) => {
        return request(app)
        .post(apiUrl + 'users/')
        .send({ id: 0, text: 'Tobi' })
        .expect(200)
        .then(res => {
            // check that it sends back the text
            expect(res.body.text).toBe('Tobi')
            done()
        })
    })

    // test the PUT /api/<version>/users/1 route
    it('should update an user object', (done) => {
        return request(app)
        .put(apiUrl + 'users/1')
        .send({ id: 0, text: 'Felix' })
        .expect(204)
        .then(res => done())
    })

    // test the DELETE /api/<version>/users/1 route
    it('should update an user object', (done) => {
        return request(app)
        .delete(apiUrl + 'users/1')
        .expect(204)
        .then(res => done())
    })

})
