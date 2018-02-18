import sinon from 'sinon';
import { NoSuchStub } from './errors'


export default () => {
  let lastId = 0;
  let stubsById = {};
  let stubsByPath = {};

  return {
    createStub({
      method, path, respondsWith, notifies,
    }) {
      const { headers, status, body } = respondsWith || {};

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
      const stub = stubsById[id];
      if (!stub) { throw new NoSuchStub(); }
      return stub;
    },
    findStub(path, method) {
      const stub = stubsByPath[path];

      if (!stub) { throw new NoSuchStub(); }
      if (method.toLowerCase() !== stub.method.toLowerCase()) {
        throw new NoSuchStub();
      }

      return stub;
    },
  };
};
