import { SchemaValidationFailed } from '../errors';

// Expressjs needs `next` as fourth parameter to identify this middleware as
// an error handling middleware.
// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  if (err instanceof SchemaValidationFailed) {
    res.status(400).json({ errors: err.errors });
    return;
  }
  // eslint-disable-next-line no-console
  console.error(err);
  res.sendStatus(500);
};
