import 'regenerator-runtime';
import fs from 'fs';
import appRootPath from 'app-root-path';

import 'config/env';
import app from './app';
import { logger } from 'utils/logger';

// GENERATE UPLOAD DIR IF NOT EXISTS
const UPLOAD_PATH = appRootPath.path + '/public/uploads';
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH);
}

const PORT = ENV.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on ${PORT}`);
});

// handling err unhandled rejection
process.on('unhandledRejection', (err) => {
  logger.error(JSON.stringify(err));
  logger.error('UNHANDLED REJECTION ERR, SHUTTINGDOWN APPLICATION');

  server.close(() => {
    // code for exit database ....
  });
});

// handling err uncaught exception
process.on('uncaughtException', (err) => {
  logger.error(JSON.stringify(err));
  logger.error('UNCAUGHT EXPRESSION ERR, SHUTTINGDOWN APPLICATION');

  server.close(() => {
    // code for exit database ....
  });
});
