import { expect } from 'chai';
import { fromCallback } from 'bluebird';
import http from 'http';
import request from 'supertest';

import server from '../src';


describe('stub with webhooks', () => {
  let app;
  let notificationServer;
  let notificationUri;
  let notificationId;

  before('create notifification instance', async () => {
    const napp = server();
    notificationServer = http.createServer(napp);
    await fromCallback(cb => notificationServer.listen(0, undefined, undefined, cb));
    notificationUri = `http://127.0.0.1:${notificationServer.address().port}`;
  });

  after('shutdown notification instance', async () => {
    await fromCallback(cb => notificationServer.close(cb));
  });


  beforeEach('create instance under test', () => {
    app = server();
  });

  beforeEach('reset notification spies', async () => {
    await request(notificationUri)
      .delete('/stubs')
      .expect(204);

    const { body: { id } } = await request(notificationUri)
      .post('/stubs')
      .send({
        method: 'post',
        path: '/notification',
        respondsWith: {
          status: 204,
        },
      })
      .expect(201);
    notificationId = id;
  });

  it('calls webhook when stubbed route is called', async () => {
    await request(app)
      .post('/stubs')
      .send({
        method: 'get',
        path: '/notify',
        respondsWith: {
          status: 204,
        },
        notifies: {
          uri: `${notificationUri}/notification`,
          method: 'post',
          body: { text: 'notify was called' },
          headers: {
            authorization: 'Bearer secret_token',
          },
        },
      })
      .expect(201);


    await request(app)
      .get('/notify')
      .expect(204);

    const { body: notificationStub } = await request(notificationUri)
      .get(`/stubs/${notificationId}`)
      .expect(200);

    expect(notificationStub).to.have.property('callCount', 1);
    const event = notificationStub.calls[0];
    expect(event).to.have.property('body').which.deep.equals({ text: 'notify was called' });
    expect(event).to.have.property('headers')
      .which.has.property('authorization', 'Bearer secret_token');
  });
});
