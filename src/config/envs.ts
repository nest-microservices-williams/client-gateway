import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
}

const envVarsSchema = joi.object<EnvVars>({
  PORT: joi.number().default(3000),
  NATS_SERVERS: joi.array().items(joi.string()).required(),
});

function validateEnv<T>(
  schema: joi.ObjectSchema<T>,
  env: NodeJS.ProcessEnv = process.env,
): T {
  const { value, error } = schema.validate(
    {
      ...env,
      NATS_SERVERS: env.NATS_SERVERS?.split(','),
    },
    {
      allowUnknown: true,
      convert: true,
    },
  );

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
  nats_servers: validatedEnv.NATS_SERVERS,
};
