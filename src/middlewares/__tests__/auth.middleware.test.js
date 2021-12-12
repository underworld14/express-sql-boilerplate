import authMiddleware from 'middlewares/auth.middleware';
import * as generate from 'utils/generate';
import * as security from 'utils/security';
import DB from 'models';

jest.mock('../../models');

test('Auth middleware should prevent user access if token is not provided on cookies/header', async () => {
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();

  req.header.mockImplementationOnce(() => '');

  await authMiddleware(req, res, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  [Error: Authentication token missing],
]
`);
});

test('Auth middleware should accept token from http cookies', async () => {
  const user = generate.buildUser();
  const req = generate.buildReq({
    cookies: { Authorization: security.generateToken({ id: user.id }) },
  });
  const res = generate.buildRes();
  const next = generate.buildNext();

  DB.User.findOne.mockResolvedValueOnce(user);

  await authMiddleware(req, res, next);

  expect(DB.User.findOne).toHaveBeenCalledWith({
    where: { id: user.id },
    attributes: { exclude: 'password' },
  });
  expect(DB.User.findOne).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith();
  expect(req.user).toEqual(user);
});

test('Auth middleware should accept token from http headers', async () => {
  const user = generate.buildUser();
  const req = generate.buildReq();
  const res = generate.buildRes();
  const next = generate.buildNext();

  req.header.mockImplementation(() => `Bearer ${security.generateToken({ id: user.id })}`);

  DB.User.findOne.mockResolvedValueOnce(user);

  await authMiddleware(req, res, next);

  expect(DB.User.findOne).toHaveBeenCalledWith({
    where: { id: user.id },
    attributes: { exclude: 'password' },
  });
  expect(DB.User.findOne).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith();
  expect(req.user).toEqual(user);
});

test('Auth middleware should prevent user access if token is invalid', async () => {
  const req = generate.buildReq({
    cookies: { Authorization: '__INVALID_TOKEN__' },
  });
  const res = generate.buildRes();
  const next = generate.buildNext();

  await authMiddleware(req, res, next);

  expect(DB.User.findOne).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  [Error: Invalid authentication token],
]
`);
});

test('Auth middleware should prevent user access if user is unavailable', async () => {
  const user = generate.buildUser();
  const req = generate.buildReq({
    cookies: { Authorization: security.generateToken({ id: user.id }) },
  });
  const res = generate.buildRes();
  const next = generate.buildNext();

  DB.User.findOne.mockResolvedValueOnce(null);

  await authMiddleware(req, res, next);

  expect(DB.User.findOne).toHaveBeenCalledWith({
    where: { id: user.id },
    attributes: { exclude: 'password' },
  });
  expect(DB.User.findOne).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledTimes(1);
  expect(next.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  [Error: Invalid authentication token],
]
`);
});
