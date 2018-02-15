import Router from 'express-promise-router';

const uriControlPrefix = process.env.STUBBI_CTRL_PREFIX || '/stubs';

const router = Router();

let lastId = 0;
const stubsById = {};
const stubsByPath = {};

const createNewStub = (req, res) => {
  const {
    method, path, body, status,
  } = req.body;

  lastId += 1;
  const id = lastId;
  const newStub = {
    id, method, path, body, status, callCount: 0,
  };

  stubsById[id] = newStub;
  stubsByPath[path] = newStub;

  res.status(201);
  res.json(newStub);
};

const deleteStubById = (req, res) => {
  const { id } = req.params;

  const { path } = stubsById[id];
  delete stubsById[id];
  delete stubsByPath[path];

  res.sendStatus(204);
};

const getStubById = (req, res) => {
  const { id } = req.params;
  const stub = stubsById[id];
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
  const stub = stubsByPath[path];

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

export default router;
