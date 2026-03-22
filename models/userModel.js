import db from '../config/db.js';

export default class User {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        newsletter_opt_in BOOLEAN DEFAULT FALSE,
        terms_accepted BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
  }

  static async createUser(name, email, password, dob, phone, newsletter_opt_in, terms_accepted) {
    const query = `
      INSERT INTO users (name, email, password, dob, phone, newsletter_opt_in, terms_accepted)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, dob, phone, newsletter_opt_in, terms_accepted, created_at;
    `;
    const result = await db.query(query, [name, email, password, dob, phone, newsletter_opt_in, terms_accepted]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, dob, phone, newsletter_opt_in, terms_accepted, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
