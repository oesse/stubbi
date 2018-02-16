import Router from 'express-promise-router';

import createStubs from './endpoints/create-stubs';
import deleteStubs from './endpoints/delete-stubs';
import deleteStubsById from './endpoints/delete-stubs-by-id';
import getStubsById from './endpoints/get-stubs-by-id';
import callStub from './endpoints/call-stub';

import handleErrors from './handle-errors';

import stubRepository from './stub-repository';


export default (uriControlPrefix) => {
  const router = Router();

  const stubs = stubRepository();

  router.use((req, res, next) => {
    req.stubs = stubs;
    next();
  });
  router.post(uriControlPrefix, createStubs);
  router.delete(`${uriControlPrefix}/:id`, deleteStubsById);
  router.delete(uriControlPrefix, deleteStubs);
  router.get(`${uriControlPrefix}/:id`, getStubsById);

  router.use('*', callStub);

  router.use(handleErrors);

  return router;
};

