import bcrypt from 'bcrypt';
import db from '../config/db.js';

export default class AdminUser {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INTEGER REFERENCES roles(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
  }

  static async createAdmin(name, email, password, roleId) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO admin_users (name, email, password, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role_id, created_at;
    `;
    const result = await db.query(query, [name, email, hashedPassword, roleId]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = `
      SELECT u.*, r.name as role_name, r.permissions 
      FROM admin_users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT u.id, u.name, u.email, u.created_at, r.name as role_name 
      FROM admin_users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      ORDER BY u.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async update(id, { name, email, password, roleId }) {
    let query = 'UPDATE admin_users SET name = $1, email = $2, role_id = $3';
    const params = [name, email, roleId];
    let paramIndex = 4;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = $${paramIndex}`;
      params.push(hashedPassword);
      paramIndex++;
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, name, email, role_id, created_at;`;
    params.push(id);

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM admin_users WHERE id = $1 RETURNING id;';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
