import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dbConfig from 'db/config';
import { logger } from 'utils/logger';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];
const DB = {};

const { database, username, password, host, dialect } = config;

const sequelize = new Sequelize.Sequelize(database, username, password, {
  host,
  dialect,
  timezone: '+07:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    DB[model.name] = model;
  });

Object.keys(DB).forEach((modelName) => {
  if (DB[modelName].associate) {
    DB[modelName].associate(DB);
  }
});

DB.sequelize = sequelize;
DB.Sequelize = Sequelize;

export default DB;
