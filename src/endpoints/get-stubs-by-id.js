export default (req, res) => {
  const { id } = req.params;
  const stub = req.stubs.getStubById(id);

  const {
    method, path, respondsWith, notifies, call: callStub,
  } = stub;

  const calls = callStub.getCalls().map(call => call.args[0]);
  res.json({
    id, method, path, respondsWith, notifies, callCount: callStub.callCount, calls,
  });
};
