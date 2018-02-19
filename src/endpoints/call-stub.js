import request from 'request-promise';

const notify = async (notifyOptions) => {
  await request({
    json: true,
    ...notifyOptions,
  });
};

const setHeaders = (res, headers) =>
  Object.keys(headers || {}).forEach(key => res.set(key, headers[key]));

export default async (req, res) => {
  const path = req.params[0];
  const stub = req.stubs.findStub(path, req.method);

  const { headers, query, body } = req;
  const response = stub.call({ headers, query, body });

  if (stub.notifies) {
    await notify(stub.notifies);
  }

  setHeaders(res, response.headers);
  res
    .status(response.status || 200)
    .json(response.body);
};
