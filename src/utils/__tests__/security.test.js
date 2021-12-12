import * as security from 'utils/security';

test('Should decrypt & compare same password successfull', async () => {
  const password = '__SECRET_PASSWORD__';
  const hashedPasswrod = await security.hashPasword(password);
  const compared = await security.comparePassword(password, hashedPasswrod);

  expect(compared).toBe(true);
});

test('should generate jwt token & decrypt it', async () => {
  const payload = { id: 'FAKE_USER_ID' };
  const token = security.generateToken(payload);
  const decodedToken = await security.decodedToken(token);

  expect(decodedToken).toMatchObject(payload);
});

test('sendTokenCookie should send token as a cookie', () => {
  const res = {
    cookie: jest.fn(() => res),
  };
  const payload = { id: 'FAKE_USER_ID' };
  const token = security.generateToken(payload);

  security.sendTokenCookie(res, token);

  expect(res.cookie).toHaveBeenCalledWith('Authorization', token, {
    httpOnly: true,
    secure: false,
  });
  expect(res.cookie).toHaveBeenCalledTimes(1);
});

test('sendTokenCookie should send token as a secure cookie on production', () => {
  process.env.NODE_ENV = 'production';
  const res = {
    cookie: jest.fn(() => res),
  };
  const payload = { id: 'FAKE_USER_ID' };
  const token = security.generateToken(payload);

  security.sendTokenCookie(res, token);

  expect(res.cookie).toHaveBeenCalledWith('Authorization', token, {
    httpOnly: true,
    secure: true,
  });
  expect(res.cookie).toHaveBeenCalledTimes(1);
  process.env.NODE_ENV = 'test';
});
