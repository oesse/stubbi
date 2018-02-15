import Router from 'express-promise-router';

const uriControlPrefix = process.env.STUBBI_CTRL_PREFIX || '/stubs';

const router = Router();

let lastId = 0;
const stubsById = {};
const stubsByPath = {};

router.post(uriControlPrefix, (req, res) => {
  const {
    method, path, body, status,
  } = req.body;

  lastId += 1;
  const id = lastId;
  const newStub = {
    id, method, path, body, status,
  };

  stubsById[id] = newStub;
  stubsByPath[path] = newStub;

  res.status(201);
  res.json(newStub);
});

router.delete(`${uriControlPrefix}/:id`, (req, res) => {
  const { id } = req.params;

  const { path } = stubsById[id];
  delete stubsById[id];
  delete stubsByPath[path];

  res.sendStatus(204);
});

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

  res
    .status(stub.status || 200)
    .json(stub.body);
});

export default router;
