import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  RAILRADAR_API_KEY: z.string().optional().default('dev_railradar_key'),
  OPENWEATHER_API_KEY: z.string().optional(),
  MAPTILER_API_KEY: z.string().optional(),
  OPENTOPOGRAPHY_API_KEY: z.string().optional(),
  OVERPASS_ENDPOINT: z.string().url().default('https://overpass-api.de/api/interpreter'),
  DATABASE_URL: z.string().default('postgresql://railgaadi:railgaadi@localhost:5432/railgaadi'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  SHARE_SIGNING_SECRET: z.string().optional().default('dev_secret_key_123'),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
