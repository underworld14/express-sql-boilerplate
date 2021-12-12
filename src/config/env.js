import dotenv from 'dotenv';
import { cleanEnv, str, port, host, url } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
  APP_KEY: str(),
  APP_URL: url({ default: 'https://app.niikah.id', devDefault: 'http://localhost:4000' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ devDefault: 4000 }),
  DB_DIALECT: str({ choices: ['mysql', 'postgres', 'mariadb'] }),
  DB_HOST: host(),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  SMTP_HOST: host(),
  SMTP_PORT: port(),
  SMTP_USER: str(),
  SMTP_PASSWORD: str(),
});

global['ENV'] = env;

export default env;
