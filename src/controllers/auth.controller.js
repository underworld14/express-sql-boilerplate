import path from 'path';
import multer from 'multer';
import express from 'express';
import randomstring from 'randomstring';
import * as security from 'utils/security';
import * as authService from 'services/auth.service';
import HttpException from 'exceptions/HttpException';
import catchAsync from 'exceptions/catchAsync';
import sharp from 'sharp';

/**
 * Handle user register.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const register = async (req, res) => {
  const response = await authService.register(req.body);

  // sending welcome & verification email
  authService.sendWelcomeEmail(response.user);

  // also send token as http-cookie
  security.sendTokenCookie(res, response.access_token);

  return res.status(200).json({
    message: 'success',
    ...response,
  });
};

/**
 * Handle user login.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const login = async (req, res, next) => {
  const response = await authService.login(req.body);

  // send token as http-cookie
  security.sendTokenCookie(res, response.access_token);

  return res.status(200).json({
    message: 'success',
    ...response,
  });
};

export const logout = (req, res, next) => {
  security.sendTokenCookie(res, '');
  return res.status(200).json({
    status: 'success',
  });
};

export const check = (req, res) => {
  return res.status(200).json({
    message: 'success',
    user: req.user.toJSON(),
  });
};

/**
 * Handle forgot password.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json({
    status: 'success',
    message: `If Email exist, The reset password email will be sent to ${req.body.email}`,
  });
};

/**
 * Handle forgot password.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const resetPassword = async (req, res) => {
  await authService.resetPassword(req.body);

  return res.status(200).json({
    status: 'success',
    message: 'Password successfull reseted',
  });
};

export const reqAccountVerification = async (req, res) => {
  await authService.sendVerificationEmail(req.body.email);
  res.status(200).json({
    status: 'success',
    message: `If Email exist, The verification email will be sent to ${req.body.email}`,
  });
};

/**
 * Handle verify account.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const verifyAccount = async (req, res) => {
  await authService.verifyAccount(req.params.token);

  return res.send('Successfull verified, please login now');
};

/**
 * Handle update profile for the user.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const updateProfile = async (req, res) => {
  req.file && Object.assign(req.body, { photo: req.file.filename });
  const item = await authService.updateProfile(req.user, req.body);

  return res.status(200).json({
    message: 'success',
    item,
  });
};

/**
 * Handle update password for the user.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const updatePassword = async (req, res) => {
  await authService.updateUserPassword(req.user, req.body);

  return res.status(200).json({
    status: 'success',
    message: 'Password successfully updated',
  });
};

export const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1000 * 1000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new HttpException(400, 'Only image file'));
    }
  },
}).single('photo');

export const processFile = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const uploadpath = path.join(__dirname, '../../public/uploads');

  req.file.filename = `${req.user.id}${randomstring.generate(12)}.jpeg`;
  await sharp(req.file.buffer).toFormat('jpeg').jpeg({ quality: 70 }).toFile(`${uploadpath}/${req.file.filename}`);

  next();
});
