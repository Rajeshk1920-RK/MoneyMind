import pkg from 'pg';
const { Pool, Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const PG_USER = process.env.PG_USER || 'postgres';
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';
const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_PORT = parseInt(process.env.PG_PORT || '5432', 10);
const PG_DATABASE = process.env.PG_DATABASE || 'moneymind';

// Step 1: Ensure database exists
export async function ensureDatabaseExists() {
  const rootClient = new Client({
    host: PG_HOST,
    port: PG_PORT,
    user: PG_USER,
    password: PG_PASSWORD,
    database: 'postgres'
  });

  try {
    await rootClient.connect();
    const checkDb = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [PG_DATABASE]
    );

    if (checkDb.rowCount === 0) {
      console.log(`Database "${PG_DATABASE}" does not exist. Creating it now...`);
      await rootClient.query(`CREATE DATABASE "${PG_DATABASE}"`);
      console.log(`Database "${PG_DATABASE}" created successfully!`);
    }
  } catch (err) {
    console.error('Database existence check note:', err.message);
    throw err;
  } finally {
    await rootClient.end();
  }
}

// Step 2: Pool connected to moneymind database
export const pool = new Pool({
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  max: 20,
  idleTimeoutMillis: 30000
});

// Step 3: Initialize all tables
export async function initTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar VARCHAR(10) DEFAULT 'MM',
        currency VARCHAR(10) DEFAULT 'INR',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        merchant VARCHAR(255),
        amount NUMERIC(12, 2) NOT NULL,
        type VARCHAR(20) NOT NULL,
        category VARCHAR(100) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'UPI',
        date DATE NOT NULL,
        notes TEXT,
        tags TEXT[],
        intent_category VARCHAR(100),
        intent_note TEXT,
        intent_for VARCHAR(100),
        intent_captured BOOLEAN DEFAULT FALSE,
        source VARCHAR(50) DEFAULT 'manual',
        payment_status VARCHAR(50) DEFAULT 'success',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Safe auto-migrations for existing installations
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS merchant VARCHAR(255);
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS intent_category VARCHAR(100);
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS intent_note TEXT;
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS intent_for VARCHAR(100);
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS intent_captured BOOLEAN DEFAULT FALSE;
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual';
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'success';

      CREATE TABLE IF NOT EXISTS budgets (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        monthly_limit NUMERIC(12, 2) NOT NULL,
        alert_threshold INT DEFAULT 80,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category)
      );

      CREATE TABLE IF NOT EXISTS goals (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        target_amount NUMERIC(12, 2) NOT NULL,
        current_amount NUMERIC(12, 2) DEFAULT 0,
        target_date DATE,
        category VARCHAR(100) DEFAULT 'Safety Net',
        color VARCHAR(20) DEFAULT '#16382b',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otps (
        email VARCHAR(255) PRIMARY KEY,
        otp VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('PostgreSQL tables initialized successfully!');
  } finally {
    client.release();
  }
}
