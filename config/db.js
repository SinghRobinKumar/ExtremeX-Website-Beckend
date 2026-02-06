import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
