import Joi from 'joi';
import httpStatus from 'http-status';
import { pick } from 'lodash';
import HttpException from 'exceptions/HttpException';

/**
 * Middleware to validate params, query and post data from express request.
 * All validation definition located on src/validations.
 *
 * @param {object} schema
 * @returns {void}
 */

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);
  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new HttpException(httpStatus.UNPROCESSABLE_ENTITY, errorMessage));
  }
  req.body = value.body;
  return next();
};

export default validate;
