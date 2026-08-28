import { Pool, QueryResultRow } from 'pg';
import { env } from '../config/env';
import { logger } from '../logger';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('error', (err) => {
  logger.error(err, 'Unexpected error on idle PostgreSQL client');
});

export const query = async <T extends QueryResultRow>(
  text: string,
  params?: any[]
) => {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  logger.debug({ query: text, duration, rows: res.rowCount }, 'Executed query');
  return res;
};
