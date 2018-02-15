import Router from 'express-promise-router';

const uriControlPrefix = process.env.STUBBI_CTRL_PREFIX || '/stubs';

const router = Router();

const stubsById = {};
const stubsByPath = {};

router.use(uriControlPrefix, (req, res) => {
  const {
    method, path, body, status,
  } = req.body;
  const id = Object.keys(stubsById).length;
  const newStub = {
    id, method, path, body, status,
  };

  stubsById[id] = newStub;
  stubsByPath[path] = newStub;

  res.status(201);
  res.json(newStub);
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
