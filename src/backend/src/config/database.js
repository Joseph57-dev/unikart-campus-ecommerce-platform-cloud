const { Pool } = require('pg');
const config = require('./index');

const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl,
  max: 20, // max pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('PostgreSQL pool: Client connected');
});

module.exports = pool;
