import db from '../config/db.js';

export default class Role {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        permissions JSONB DEFAULT '[]',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
  }

  static async createRole(name, permissions, description) {
    const query = `
      INSERT INTO roles (name, permissions, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(query, [name, JSON.stringify(permissions), description]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = 'SELECT * FROM roles WHERE name = $1';
    const result = await db.query(query, [name]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM roles ORDER BY id ASC';
    const result = await db.query(query);
    return result.rows;
  }

  static async updateRole(id, name, permissions, description) {
    const query = `
      UPDATE roles
      SET name = $1, permissions = $2, description = $3
      WHERE id = $4
      RETURNING *;
    `;
    const result = await db.query(query, [name, JSON.stringify(permissions), description, id]);
    return result.rows[0];
  }

  static async deleteRole(id) {
    const query = 'DELETE FROM roles WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
