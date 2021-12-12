import { promisify } from 'util';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPasword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (inputed, realPassword) => {
  return await bcrypt.compare(inputed, realPassword);
};

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.APP_KEY, { expiresIn: '1d' });
};

export const decodedToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.APP_KEY);
};

export const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('Authorization', token, cookieOptions);
};
