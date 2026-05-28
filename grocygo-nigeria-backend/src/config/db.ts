import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  // Add SSL if the host is Render, otherwise leave it false for local testing
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : false,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;