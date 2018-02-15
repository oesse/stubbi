import Router from 'express-promise-router';
import stubRepository from './stub-repository';


export default (uriControlPrefix) => {
  const router = Router();

  const stubs = stubRepository();


  const createNewStub = (req, res) => {
    const {
      method, path, body, status,
    } = req.body;

    const newStub = stubs.createStub({
      method, path, body, status,
    });

    res.status(201);
    res.json(newStub);
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

    res.json(stub);
  };

  router.post(uriControlPrefix, createNewStub);
  router.delete(`${uriControlPrefix}/:id`, deleteStubById);
  router.get(`${uriControlPrefix}/:id`, getStubById);

  router.use('*', (req, res) => {
    const path = req.params[0];
    const stub = stubs.getStubByPath(path);

    if (!stub) {
      res.sendStatus(404);
      return;
    }

    if (req.method.toLowerCase() !== stub.method.toLowerCase()) {
      res.sendStatus(404);
      return;
    }

    stub.callCount += 1;
    res
      .status(stub.status || 200)
      .json(stub.body);
  });

  return router;
};

