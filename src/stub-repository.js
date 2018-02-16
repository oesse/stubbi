import sinon from 'sinon';


export default () => {
  let lastId = 0;
  let stubsById = {};
  let stubsByPath = {};

  return {
    createStub({
      method, path, respondsWith, notifies,
    }) {
      const { headers, status, body } = respondsWith;

      lastId += 1;
      const id = lastId;

      const newStub = {
        id,
        method,
        path,
        respondsWith,
        notifies,
        call: sinon.stub().returns({ headers, status, body }),
      };

      stubsById[id] = newStub;
      stubsByPath[path] = newStub;

      return newStub;
    },
    deleteStub(id) {
      const { path } = stubsById[id];
      delete stubsById[id];
      delete stubsByPath[path];
    },
    deleteAllStubs() {
      stubsById = {};
      stubsByPath = {};
    },
    getStubById(id) {
      return stubsById[id];
    },
    findStub(path, method) {
      const stub = stubsByPath[path];

      if (!stub) { return undefined; }
      if (method.toLowerCase() !== stub.method.toLowerCase()) {
        return undefined;
      }

      return stub;
    },
  };
};
