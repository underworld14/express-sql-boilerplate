import httpStatus from 'http-status';
import HttpException from 'exceptions/HttpException';
import { logger } from 'utils/logger';

const errorMiddleware = (error, req, res, next) => {
  if (!(error instanceof HttpException)) {
    const status = httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[status];
    error = new HttpException(status, message);
  }

  const response = {
    code: error.status,
    message: error.message,
    stack: error.stack,
  };

  if (process.env.NODE_ENV === 'production') {
    delete response.stack;
  }

  logger.error(`[${req.method}] ${req.path} >> status:: ${error.status}, message:: ${error.message}`);

  res.status(error.status);
  res.json(response);
};

export default errorMiddleware;
