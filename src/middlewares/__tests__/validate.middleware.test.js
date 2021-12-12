import Joi from 'joi';
import * as generate from 'utils/generate';
import validateMiddleware from '../validate.middleware';

test('Should validate req.body if not satisfy shoyld return error for the first field ', () => {
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();

  const validations = {
    body: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        name: Joi.string().required(),
        role: Joi.string(),
      })
      .strict(),
  };

  validateMiddleware(validations)(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  [Error: "email" is required],
]
`);
});

test('Should success validate and assign the value to req.value and call next', () => {
  const req = generate.buildReq({
    body: {
      email: 'test@email.com',
      password: 'test1234',
      name: 'Test User',
    },
  });
  const res = generate.buildRes();
  const next = generate.buildNext();

  const validations = {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
      name: Joi.string().required(),
      role: Joi.string(),
    }),
  };

  validateMiddleware(validations)(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith();
  expect(req.value.body).toMatchObject(req.body);
});
