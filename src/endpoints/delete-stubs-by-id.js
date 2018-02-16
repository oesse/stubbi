export default (req, res) => {
  const { id } = req.params;
  req.stubs.deleteStub(id);
  res.sendStatus(204);
};
