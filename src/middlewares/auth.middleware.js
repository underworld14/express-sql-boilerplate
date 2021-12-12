import httpStatus from 'http-status';
import HttpException from 'exceptions/HttpException';

import DB from 'models';
import * as security from 'utils/security';

const authMiddleware = async (req, res, next) => {
  try {
    const Authorization = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;

    if (Authorization) {
      const verificationResponse = await security.decodedToken(Authorization);
      const userId = verificationResponse.id;
      const findUser = await DB.User.findOne({
        where: { id: userId },
      });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(httpStatus.UNAUTHORIZED, 'Invalid authentication token'));
      }
    } else {
      next(new HttpException(httpStatus.UNAUTHORIZED, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(httpStatus.UNAUTHORIZED, 'Invalid authentication token'));
  }
};

export default authMiddleware;
