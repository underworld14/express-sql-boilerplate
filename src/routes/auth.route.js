import { Router } from 'express';

import catchAsync from 'exceptions/catchAsync';
import * as authController from 'controllers/auth.controller';
import authMiddleware from 'middlewares/auth.middleware';
import validate from 'middlewares/validate.middleware';
import * as validations from 'validations/auth.validation';

const router = Router();

router.post('/register', validate(validations.register), catchAsync(authController.register));
router.post('/login', validate(validations.login), catchAsync(authController.login));
router.get('/check', authMiddleware, catchAsync(authController.check));
router.post('/logout', authMiddleware, catchAsync(authController.logout));
router.post('/forgot-password', validate(validations.forgotPassword), catchAsync(authController.forgotPassword));
router.post('/reset-password', validate(validations.resetPassword), catchAsync(authController.resetPassword));
router.post('/verification', validate(validations.reqVerification), catchAsync(authController.reqAccountVerification));
router.get('/verification/:token', catchAsync(authController.verifyAccount));
router.patch(
  '/user',
  authMiddleware,
  authController.uploadPhoto,
  authController.processFile,
  validate(validations.updateUser),
  catchAsync(authController.updateProfile),
);
router.patch(
  '/password',
  authMiddleware,
  validate(validations.updateUserPassword),
  catchAsync(authController.updatePassword),
);

export default router;
