// Expressjs needs `next` as fourth parameter to identify this middleware as
// an error handling middleware.
// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.sendStatus(500);
};
