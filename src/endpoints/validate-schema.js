import Ajv from 'ajv';

export default (schema) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    if (!validate(req.body)) {
      res.status(400).json({ errors: validate.errors });
      return;
    }
    next();
  };
};
