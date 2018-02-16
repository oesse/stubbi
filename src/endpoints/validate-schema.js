import Ajv from 'ajv';
import { SchemaValidationFailed } from '../errors';

export default (schema) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    if (!validate(req.body)) {
      throw new SchemaValidationFailed([...validate.errors]);
    }
    next();
  };
};
