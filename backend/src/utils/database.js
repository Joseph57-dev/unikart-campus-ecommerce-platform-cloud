const pool = require('../config/database');

// Generic query executor
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get single row
const getOne = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0];
};

// Get all rows
const getAll = async (text, params) => {
  const result = await query(text, params);
  return result.rows;
};

// Get count
const getCount = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0].count;
};

// Insert and return
const insert = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0];
};

// Update and return
const update = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0];
};

// Delete
const remove = async (text, params) => {
  const result = await query(text, params);
  return result.rowCount > 0;
};

module.exports = {
  query,
  getOne,
  getAll,
  getCount,
  insert,
  update,
  remove
};
