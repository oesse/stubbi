import Router from 'express-promise-router';
import request from 'request-promise';
import stubRepository from './stub-repository';


export default (uriControlPrefix) => {
  const router = Router();

  const stubs = stubRepository();


  const createNewStub = (req, res) => {
    const {
      method, path, respondsWith, notifies,
    } = req.body;

    const { id } = stubs.createStub({
      method, path, respondsWith, notifies,
    });

    res.status(201);
    res.json({
      id, method, path, respondsWith, notifies,
    });
  };

  const deleteStubById = (req, res) => {
    const { id } = req.params;

    stubs.deleteStub(id);

    res.sendStatus(204);
  };

  const deleteAllStubs = (req, res) => {
    stubs.deleteAllStubs();
    res.sendStatus(204);
  };

  const getStubById = (req, res) => {
    const { id } = req.params;
    const stub = stubs.getStubById(id);

    if (!stub) {
      res.sendStatus(404);
      return;
    }

    const {
      method, path, respondsWith, notifies, call: callStub,
    } = stub;

    const calls = callStub.getCalls().map(call => call.args);
    res.json({
      id, method, path, respondsWith, notifies, callCount: callStub.callCount, calls,
    });
  };

  router.post(uriControlPrefix, createNewStub);
  router.delete(`${uriControlPrefix}/:id`, deleteStubById);
  router.delete(uriControlPrefix, deleteAllStubs);
  router.get(`${uriControlPrefix}/:id`, getStubById);


  const notify = async ({ path, method, body }) => {
    await request({
      uri: path,
      method,
      body,
    });
  };

  router.use('*', async (req, res) => {
    const path = req.params[0];
    const stub = stubs.findStub(path, req.method);

    if (!stub) {
      res.sendStatus(404);
      return;
    }
    const { headers, query, body } = req;

    const response = stub.call({ headers, query, body });

    if (stub.notifies) {
      await notify(stub.notifies);
    }

    Object.keys(response.headers || {}).forEach(key => res.set(key, response.headers[key]));
    res
      .status(response.status || 200)
      .json(response.body);
  });

  return router;
};

