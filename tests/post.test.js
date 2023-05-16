/* eslint-disable no-undef */
const request = require('supertest')
const app = require('../app')
describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/v1/posts')
      .send({
        _id: '627ab8673b75cf8fbb22fa0b',
        description: 'lalala',
        title: 'test is cool'
      })
    expect(res.statusCode).toEqual(201)
  })
  it('list posts', async () => {
    const res = await request(app)
      .get('/v1/posts')
    expect(res.statusCode).toEqual(200)
  })
  it('get post by id', async () => {
    const res = await request(app)
      .get('/v1/posts/627ab8673b75cf8fbb22fa0b')
    expect(res.statusCode).toEqual(200)
  })
  it('save post', async () => {
    const res = await request(app)
      .put('/v1/posts/627ab8673b75cf8fbb22fa0b')
      .send({
        title: 'test is cool !!!!!'
      })
    expect(res.statusCode).toEqual(203)
  })
  it('delete post', async () => {
    const res = await request(app)
      .delete('/v1/posts/627ab8673b75cf8fbb22fa0b')
    expect(res.statusCode).toEqual(203)
  })
})
