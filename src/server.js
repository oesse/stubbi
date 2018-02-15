import express from 'express';
import bodyParser from 'body-parser';

import router from './router';

const defaultOptions = {
  uriControlPrefix: '/stubs',
};

export default (options) => {
  const realOptions = { ...defaultOptions, options };

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(router(realOptions.uriControlPrefix));

  return app;
};
