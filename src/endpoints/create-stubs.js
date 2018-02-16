import validateSchema from '../middlewares/validate-schema';

export default [
  validateSchema({
    properties: {
      method: {
        type: 'string',
        enum: ['get', 'post', 'put', 'patch', 'delete'],
      },
      path: { type: 'string' },
      respondsWith: {
        properties: {
          headers: { type: 'object' },
          status: { type: 'integer' },
          body: {
            anyOf: [{ type: 'string' }, { type: 'object' }],
          },
        },
        additionalProperties: false,
      },
      notifies: { type: 'object' },
    },
    required: ['method', 'path'],
    additionalProperties: false,
  }),
  (req, res) => {
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
  },
];
