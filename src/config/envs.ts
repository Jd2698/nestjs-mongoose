import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  MONGODB_URL: string;
  PORT: number;
}

const envSchema = joi
  .object({
    MONGODB_URL: joi.string().required(),
    PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongodbURL: envVars.MONGODB_URL,
};
