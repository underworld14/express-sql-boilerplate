import defaultJoi from 'joi';
import JoiPhoneNumber from 'joi-phone-number';

const Joi = defaultJoi.extend(JoiPhoneNumber);

const baseRegister = {
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  name: Joi.string().required(),
  role: Joi.string(),
  phone: Joi.string().phoneNumber({ defaultCountry: 'ID', format: 'e164' }).allow('', null),
};

const baseLogin = {
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
};

if (ENV.isProduction) {
  console.log('produciton lur');
  baseRegister['recaptcha_token'] = Joi.string().required();
  baseLogin['recaptcha_token'] = Joi.string().required();
}

export const register = {
  body: baseRegister,
};

export const login = {
  body: baseLogin,
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  body: Joi.object()
    .keys({
      token: Joi.string().required(),
      password: Joi.string().min(5).required(),
      re_password: Joi.ref('password'),
    })
    .with('password', 're_password'),
};

export const reqVerification = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const updateUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    phone: Joi.string().phoneNumber({ defaultCountry: 'ID', format: 'e164' }).allow('', null),
  }),
};

export const updateUserPassword = {
  body: Joi.object()
    .keys({
      current_password: Joi.string().required(),
      new_password: Joi.string().min(5).required(),
      re_new_password: Joi.ref('new_password'),
    })
    .with('new_password', 're_new_password'),
};
