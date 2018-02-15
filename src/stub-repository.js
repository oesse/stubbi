export default () => {
  let lastId = 0;
  const stubsById = {};
  const stubsByPath = {};

  return {
    createStub({
      method, path, body, status,
    }) {
      lastId += 1;
      const id = lastId;

      const newStub = {
        id, method, path, body, status, callCount: 0,
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
