// pool.js

// Load environment variables from .env file (if running locally)
require('dotenv').config();

const { Pool } = require('pg');

// Use DATABASE_URL from environment variables (Heroku will set this)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Heroku's managed PostgreSQL
  },
});

module.exports = pool;
