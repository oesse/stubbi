export default (req, res) => {
  const {
    method, path, respondsWith, notifies,
  } = req.body;


  const { id } = req.stubs.createStub({
    method, path, respondsWith, notifies,
  });

  res.status(201);
  res.json({
    id, method, path, respondsWith, notifies,
  });
};
