import { expect } from 'chai';
import request from 'supertest';

import app from '../src/server';

const addStub = stubSpec =>
  request(app)
    .post('/stubs')
    .send(stubSpec);

describe('stubbi API', () => {
  describe('add stub', () => {
    it('adds stub route which returns the given response', async () => {
      const { body: stub } = await addStub({
        method: 'get',
        path: '/say-hello',
        body: 'Hello',
        status: 418,
      }).expect(201);

      expect(stub).to.have.keys('id', 'callCount', 'method', 'path', 'body', 'status');

      const stubbedResponse = await request(app)
        .get('/say-hello')
        .expect(418);
      expect(stubbedResponse.body).to.equal('Hello');
    });
  });

  describe('remove stub', () => {
    let stubId;

    beforeEach('add a stub', async () => {
      const { body: stub } = await addStub({
        method: 'get',
        path: '/say-hello',
        body: 'Hello',
        status: 418,
      }).expect(201);

      stubId = stub.id;
    });

    it('removes stub route by its id', async () => {
      await request(app)
        .delete(`/stubs/${stubId}`)
        .expect(204);

      await request(app)
        .get('/say-hello')
        .expect(404);
    });
  });

  describe('get stub call count', () => {
    let stubId;

    beforeEach('add a stub', async () => {
      const { body: stub } = await addStub({
        method: 'get',
        path: '/say-hello',
        body: 'Hello',
        status: 418,
      }).expect(201);

      stubId = stub.id;
    });

    it('removes stub route by its id', async () => {
      const { body: stubBeforeCall } = await request(app)
        .get(`/stubs/${stubId}`)
        .expect(200);

      expect(stubBeforeCall).to.have.property('callCount', 0);

      await request(app)
        .get('/say-hello')
        .expect(418);

      const { body: stubAfterCall } = await request(app)
        .get(`/stubs/${stubId}`)
        .expect(200);

      expect(stubAfterCall).to.have.property('callCount', 1);
    });
  });
});
