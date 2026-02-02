const User = require('../models/userModel');
const db = require('../config/db');

const initDb = async () => {
  try {
    await User.createTable();
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    // End the pool to allow the script to exit
    await db.pool.end();
  }
};

initDb();
