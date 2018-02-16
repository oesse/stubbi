import request from 'request-promise';

const notify = async (notifyOptions) => {
  const { path, ...rest } = notifyOptions;
  await request({
    uri: path,
    ...rest,
    json: true,
  });
};

export default async (req, res) => {
  const path = req.params[0];
  const stub = req.stubs.findStub(path, req.method);

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
};
