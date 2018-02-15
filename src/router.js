import Router from 'express-promise-router';
import stubRepository from './stub-repository';


export default (uriControlPrefix) => {
  const router = Router();

  const stubs = stubRepository();


  const createNewStub = (req, res) => {
    const {
      method, path, respondsWith,
    } = req.body;

    const { id } = stubs.createStub({
      method, path, respondsWith,
    });

    res.status(201);
    res.json({
      id, method, path, respondsWith,
    });
  };

  const deleteStubById = (req, res) => {
    const { id } = req.params;

    stubs.deleteStub(id);

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
      method, path, respondsWith, call: callStub,
    } = stub;
    const calls = callStub.getCalls().map(call => call.args);
    res.json({
      id, method, path, respondsWith, callCount: callStub.callCount, calls,
    });
  };

  router.post(uriControlPrefix, createNewStub);
  router.delete(`${uriControlPrefix}/:id`, deleteStubById);
  router.get(`${uriControlPrefix}/:id`, getStubById);

  router.use('*', (req, res) => {
    const path = req.params[0];
    const stub = stubs.findStub(path, req.method);

    if (!stub) {
      res.sendStatus(404);
      return;
    }
    const { headers, query, body } = req;

    const response = stub.call({ headers, query, body });

    Object.keys(response.headers || {}).forEach(key => res.set(key, response.headers[key]));
    res
      .status(response.status || 200)
      .json(response.body);
  });

  return router;
};

