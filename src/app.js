import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import httpStatus from 'http-status';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import { stream } from 'utils/logger';
import errorMiddleware from 'middlewares/error.middleware';
import HttpException from 'exceptions/HttpException';

// routes
import apiRoutes from 'routes';

const app = express();

app.use(morgan('tiny', { stream }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// api routes
app.use('/api', apiRoutes);

// 404 unknown routes
app.use((req, res, next) => {
  next(new HttpException(httpStatus.NOT_FOUND, 'Not found'));
});
// handle error
app.use(errorMiddleware);

export default app;
