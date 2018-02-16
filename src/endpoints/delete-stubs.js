export default (req, res) => {
  req.stubs.deleteAllStubs();
  res.sendStatus(204);
};
