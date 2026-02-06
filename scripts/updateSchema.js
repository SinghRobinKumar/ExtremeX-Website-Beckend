import db from '../config/db.js';

const updateSchema = async () => {
  try {
    const query = `
      ALTER TABLE service_requests 
      ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
    `;
    await db.query(query);
    console.log('Schema updated successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    process.exit();
  }
};

updateSchema();
