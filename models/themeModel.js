import db from '../config/db.js';

export default class Theme {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS themes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT FALSE,
        is_template BOOLEAN DEFAULT FALSE,
        colors JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create index for faster active theme lookup
      CREATE INDEX IF NOT EXISTS idx_themes_active ON themes(is_active) WHERE is_active = TRUE;
    `;
    await db.query(query);
  }

  static async create(data) {
    const { name, is_template, colors } = data;

    const query = `
      INSERT INTO themes (name, is_template, colors)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    
    const result = await db.query(query, [name, is_template || false, colors]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM themes ORDER BY is_active DESC, created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM themes WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findActive() {
    const query = 'SELECT * FROM themes WHERE is_active = TRUE LIMIT 1';
    const result = await db.query(query);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, colors } = data;
    
    const query = `
      UPDATE themes 
      SET name = COALESCE($2, name),
          colors = COALESCE($3, colors)
      WHERE id = $1 
      RETURNING *;
    `;
    
    const result = await db.query(query, [id, name, colors]);
    return result.rows[0];
  }

  static async setActive(id) {
    // Start transaction to ensure only one active theme
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Deactivate all themes
      await client.query('UPDATE themes SET is_active = FALSE');
      
      // Activate the selected theme
      const result = await client.query(
        'UPDATE themes SET is_active = TRUE WHERE id = $1 RETURNING *',
        [id]
      );
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    // Prevent deletion of template themes and active theme
    const checkQuery = 'SELECT is_template, is_active FROM themes WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    
    if (!checkResult.rows[0]) {
      throw new Error('Theme not found');
    }
    
    if (checkResult.rows[0].is_template) {
      throw new Error('Cannot delete template themes');
    }
    
    if (checkResult.rows[0].is_active) {
      throw new Error('Cannot delete active theme');
    }
    
    const query = 'DELETE FROM themes WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
