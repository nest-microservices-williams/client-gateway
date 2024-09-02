import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
  ORDERS_MICROSERVICE_HOST: string;
  ORDERS_MICROSERVICE_PORT: number;
}

const envVarsSchema = joi.object<EnvVars>({
  PORT: joi.number().default(3000),
  PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
  PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
  ORDERS_MICROSERVICE_HOST: joi.string().required(),
  ORDERS_MICROSERVICE_PORT: joi.number().required(),
});

function validateEnv<T>(
  schema: joi.ObjectSchema<T>,
  env: NodeJS.ProcessEnv = process.env,
): T {
  const { value, error } = schema.validate(env, {
    allowUnknown: true,
    convert: true,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}

type LowerCaseKeys<T> = {
  [K in keyof T as Lowercase<string & K>]: T[K];
};

const validatedEnv = validateEnv(envVarsSchema);

export const envs: LowerCaseKeys<EnvVars> = {
  port: validatedEnv.PORT,
  products_microservice_host: validatedEnv.PRODUCTS_MICROSERVICE_HOST,
  products_microservice_port: validatedEnv.PRODUCTS_MICROSERVICE_PORT,
  orders_microservice_host: validatedEnv.ORDERS_MICROSERVICE_HOST,
  orders_microservice_port: validatedEnv.ORDERS_MICROSERVICE_PORT,
};
