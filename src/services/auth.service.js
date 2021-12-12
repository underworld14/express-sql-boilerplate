import fs from 'fs';
import path from 'path';
import DB from 'models';
import { DateTime } from 'luxon';
import Handlebars from 'handlebars';
import sendMail from 'utils/mailer';
import httpStatus from 'http-status';
import randomstring from 'randomstring';
import * as security from 'utils/security';
import HttpException from 'exceptions/HttpException';

const resetPasswordUrl = process.env.RESET_PASSWORD_URL;
const resetPasswordBaseTemplate = fs.readFileSync(path.join(__dirname, '../templates/password-reset.html'), 'utf-8');
const welcomeTemplate = fs.readFileSync(path.join(__dirname, '../templates/welcome.html'), 'utf-8');
const emailConfirmTemplate = fs.readFileSync(path.join(__dirname, '../templates/email-confirmation.html'), 'utf-8');
const welcomePreCompiled = Handlebars.compile(welcomeTemplate);
const emailConfirmPreCompiled = Handlebars.compile(emailConfirmTemplate);
const resetPasswordPreCompiled = Handlebars.compile(resetPasswordBaseTemplate);

/**
 * Register service.
 *
 * @param {object} body
 * @returns
 */
export const register = async (body) => {
  // find duplicate email
  const duplicate = await DB.User.findOne({ where: { email: body.email } });
  if (duplicate) {
    throw new HttpException(httpStatus.BAD_REQUEST, 'email is exist');
  }

  // hash password
  body.password = await security.hashPasword(body.password);

  // create the user & issued the token
  let user = await DB.User.create(body);
  const access_token = security.generateToken({ id: user.id });

  // delete password from response
  user = user.toJSON();
  delete user.password;

  return {
    user,
    access_token,
  };
};

/**
 * Login services.
 *
 * @param {object} body
 */
export const login = async (body) => {
  let user = await DB.User.findOne({ where: { email: body.email } });
  if (!user) {
    throw new HttpException(httpStatus.BAD_REQUEST, 'wrong email or password');
  }

  // compared user password
  const compare = await security.comparePassword(body.password, user.password);
  if (!compare) {
    throw new HttpException(httpStatus.BAD_REQUEST, 'wrong email or password');
  }

  // check if users is verified.
  if (!user.is_verified) {
    sendVerificationEmail(user.email);
    throw new HttpException(
      httpStatus.BAD_REQUEST,
      'user email is not verified, please check your email for the verification',
    );
  }

  const access_token = security.generateToken({ id: user.id });

  // delete password from response
  user = user.toJSON();
  delete user.password;

  return {
    user,
    access_token,
  };
};

/**
 * Create verify token.
 *
 * @param {number | string} userId
 * @param {Date} expiredAt
 * @returns {Promise<string>}
 */
export const createVerifyToken = async (userId, expiredAt) => {
  await DB.ResetToken.destroy({ where: { user_id: userId } });

  const reset_token = await DB.ResetToken.create({
    user_id: userId,
    token: randomstring.generate(42),
    expired_at: expiredAt,
  });

  return reset_token.token;
};

export const verifyToken = async (token) => {
  const tokenAvailable = await DB.ResetToken.findOne({ where: { token } });
  if (!tokenAvailable) {
    throw new HttpException(400, 'Invalid token or expired token');
  }

  if (new Date() > new Date(tokenAvailable.expired_at)) {
    throw new HttpException(400, 'Invalid token or expired token');
  }

  const userId = tokenAvailable.user_id;
  await tokenAvailable.destroy();

  return userId;
};

/**
 * Forgot Password service.
 *
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  const account = await DB.User.findOne({ where: { email } });
  if (account) {
    const verifyToken = await createVerifyToken(account.id, DateTime.now().plus({ minutes: 30 }).toJSDate());

    const compiled = resetPasswordPreCompiled({
      reset_password_url: resetPasswordUrl.replace('${token}', verifyToken),
    });
    sendMail({ email, subject: 'Reset Password Email', html: compiled });
  }
};

/**
 * Reset Password service.
 *
 * @param {object} body
 */
export const resetPassword = async (body) => {
  const { token, password } = body;
  const userId = await verifyToken(token);
  const newPassword = await security.hashPasword(password);
  await DB.User.update({ password: newPassword }, { where: { id: userId } });
};

/**
 * Verify Account service.
 *
 * @param {string} token
 */
export const verifyAccount = async (token) => {
  const userId = await verifyToken(token);
  await DB.User.update({ is_verified: true }, { where: { id: userId } });
};

/**
 * Send welcome email after registration process.
 *
 * @param {object} user
 */
export const sendWelcomeEmail = async (user) => {
  if (!user.is_verified) {
    const verifyToken = await createVerifyToken(user.id, DateTime.now().plus({ days: 1 }).toJSDate());

    const compiled = welcomePreCompiled({
      name: user.name,
      verification_url: `${ENV.APP_URL}/api/auth/verification/${verifyToken}`,
    });

    sendMail({ email: user.email, subject: 'Selamat datang di Niikah.id', html: compiled });
  }
};

/**
 * Request verification email
 *
 * @param {string} email
 */
export const sendVerificationEmail = async (email) => {
  const account = await DB.User.findOne({ where: { email } });
  if (account) {
    const verifyToken = await createVerifyToken(account.id, DateTime.now().plus({ days: 1 }).toJSDate());

    const compiled = emailConfirmPreCompiled({
      verification_url: `${ENV.APP_URL}/api/auth/verification/${verifyToken}`,
    });

    sendMail({ email, subject: 'Konfirmasi Alamat Email', html: compiled });
  }
};

/**
 * Update users profile.
 *
 * @param {any} User
 * @param {object} body
 */
export const updateProfile = async (User, body) => {
  Object.assign(User, body);

  await User.save();
  return User;
};

/**
 * Update user password.
 *
 * @param {any} User
 * @param {object} body
 */
export const updateUserPassword = async (User, body) => {
  // compare password
  const compare = await security.comparePassword(body.current_password, User.password);
  if (!compare) {
    throw new HttpException(400, 'Password not match');
  }

  const newPassword = await security.hashPasword(body.new_password);
  User.password = newPassword;
  await User.save();
};
