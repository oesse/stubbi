import { expect } from 'chai';
import request from 'supertest';

import server from '../src';


describe('stubbi API', () => {
  let app;

  beforeEach('create app instance', () => {
    app = server();
  });

  const addStub = async (stubSpec) => {
    const { body } = await request(app)
      .post('/stubs')
      .send(stubSpec)
      .expect(201);

    return body.id;
  };

  describe('paths that are not registered as stubs', () => {
    it('respond with a 404 Not Found status code', async () => {
      await request(app)
        .get('/path/that/is/not/stubbed')
        .expect(404);
    });
  });
  describe('a stub', () => {
    it('can be created with a POST request to the control route', async () => {
      await request(app)
        .post('/stubs')
        .send({ method: 'get', path: '/' })
        .expect(201);
    });
    it('responds to requests at the given path with the given method with 200 OK by default', async () => {
      await request(app)
        .post('/stubs')
        .send({ method: 'delete', path: '/path/to/resource' })
        .expect(201);

      await request(app)
        .delete('/path/to/resource')
        .expect(200);
    });
    it('has a default response content type of json with utf8 encoding', async () => {
      await request(app)
        .post('/stubs')
        .send({ method: 'get', path: '/path/to/resource' })
        .expect(201);

      const response = await request(app)
        .get('/path/to/resource')
        .expect(200);

      expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8');
    });
    it('must have a method accociated with it', async () => {
      await request(app)
        .post('/stubs')
        .send({ path: '/' })
        .expect(400);
    });
    it('must have a path accociated with it', async () => {
      await request(app)
        .post('/stubs')
        .send({ method: 'post' })
        .expect(400);
    });

    it('can be removed by its id', async () => {
      const { body } = await request(app)
        .post('/stubs')
        .send({ method: 'post', path: '/path/to/resource' })
        .expect(201);

      const { id } = body;
      await request(app)
        .delete(`/stubs/${id}`)
        .expect(204);

      await request(app)
        .post('/path/to/resource')
        .expect(404);
    });


    describe('the respondsWith property', () => {
      it('can configure the response status code', async () => {
        await addStub({ method: 'get', path: '/api', respondsWith: { status: 418 } });
        await request(app)
          .get('/api')
          .expect(418);
      });
      it('can configure the response headers', async () => {
        await addStub({
          method: 'get',
          path: '/api',
          respondsWith: {
            headers: { 'x-super-header': 'Super-Value' },
          },
        });
        const response = await request(app)
          .get('/api')
          .expect(200);

        expect(response.headers).to.have.property('x-super-header', 'Super-Value');
      });
      it('can configure the response body as text', async () => {
        await addStub({
          method: 'get',
          path: '/api',
          respondsWith: {
            body: 'Hello API!',
          },
        });
        const response = await request(app)
          .get('/api')
          .expect(200);

        expect(response.body).to.equal('Hello API!');
      });
      it('can configure the response body as json', async () => {
        await addStub({
          method: 'get',
          path: '/api',
          respondsWith: {
            body: { key: 'value' },
          },
        });
        const response = await request(app)
          .get('/api')
          .expect(200);

        expect(response.body).to.deep.equal({ key: 'value' });
      });
    });

    describe('call statistics', () => {
      let stubId;
      const stubSpec = { method: 'get', path: '/api' };

      beforeEach(async () => {
        stubId = await addStub(stubSpec);
      });

      const callStub = () => request(app).get('/api');

      const getStub = () =>
        request(app)
          .get(`/stubs/${stubId}`)
          .expect(200);

      it('can be retrieved by the stubs id', async () => {
        const { body: stub } = await getStub();
        expect(stub).to.have.property('callCount');
        expect(stub).to.have.property('calls');
      });
      describe('call count', () => {
        it('is incremented for each call', async () => {
          const { body: stubBefore } = await getStub();
          expect(stubBefore).to.have.property('callCount', 0);

          await callStub();

          const { body: stubAfter } = await getStub();
          expect(stubAfter).to.have.property('callCount', 1);
        });
      });
      describe('call list', () => {
        it('has one entry for each call made to the stub', async () => {
          const { body: initalStub } = await getStub();
          expect(initalStub.calls).to.be.an('array')
            .which.has.length(0);

          await callStub();
          const { body: stubAfterOneCall } = await getStub();
          expect(stubAfterOneCall.calls).to.have.length(1);

          await callStub();
          const { body: stubAfterTwoCalls } = await getStub();
          expect(stubAfterTwoCalls.calls).to.have.length(2);
        });
        describe('each call entry', () => {
          it('saves the request query parameters', async () => {
            await callStub()
              .query({ key: 'value' });

            const { body: stub } = await getStub();

            const [call] = stub.calls;
            expect(call).to.have.property('query')
              .which.deep.equals({ key: 'value' });
          });
          it('saves the request headers', async () => {
            await callStub()
              .set('x-special-header', 'special-header-value');

            const { body: stub } = await getStub();

            const [call] = stub.calls;
            expect(call).to.have.property('headers')
              .which.has.property('x-special-header', 'special-header-value');
          });
          it('saves the request body', async () => {
            await callStub()
              .send({ message: 'Hello API' });

            const { body: stub } = await getStub();

            const [call] = stub.calls;
            expect(call).to.have.property('body')
              .which.deep.equals({ message: 'Hello API' });
          });
        });
      });
    });
  });

  describe('delete request to the control route', () => {
    it('removes all stubs', async () => {
      await addStub({ method: 'get', path: '/resource/1' });
      await addStub({ method: 'get', path: '/resource/2' });

      await request(app)
        .delete('/stubs')
        .expect(204);

      await request(app)
        .get('/resource/1')
        .expect(404);

      await request(app)
        .get('/resource/2')
        .expect(404);
    });
  });
});
