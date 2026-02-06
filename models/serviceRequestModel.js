import db from '../config/db.js';

export default class ServiceRequest {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS service_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        service_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        project_details TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
  }

  static async createRequest({ userId, serviceName, companyName, projectDetails }) {
    const query = `
      INSERT INTO service_requests (user_id, service_name, company_name, project_details)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await db.query(query, [userId, serviceName, companyName, projectDetails]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM service_requests WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async findAll() {
    const query = `
      SELECT sr.*, u.name as user_name, u.email as user_email 
      FROM service_requests sr 
      JOIN users u ON sr.user_id = u.id 
      ORDER BY sr.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async update(id, { status, progress }) {
    const query = `
      UPDATE service_requests 
      SET status = COALESCE($1, status), progress = COALESCE($2, progress)
      WHERE id = $3
      RETURNING *;
    `;
    const result = await db.query(query, [status, progress, id]);
    return result.rows[0];
  }
}
