import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'teste'])
    .default('production'),
  DATABASE_CLIENT: z.enum(['pg', 'sqlite']).default('pg'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log(_env.error.message)
  throw new Error(`Invalid environment variables: ${_env.error}`)
}

export const env = _env.data
