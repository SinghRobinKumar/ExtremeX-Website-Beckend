import db from "../config/db.js";

export default class Service {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(255),
        description TEXT,
        listing_date TIMESTAMP,
        listing_price NUMERIC(10, 2),
        discount_amount NUMERIC(10, 2),
        discount_percentage NUMERIC(5, 2),
        discount_type VARCHAR(50),
        created_by_id INTEGER,
        created_by_email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'draft',
        added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
  }

  static async create(data) {
    const {
      name,
      icon,
      description,
      listing_date,
      listing_price,
      discount_amount,
      discount_percentage,
      discount_type,
      created_by_id,
      created_by_email,
      status,
    } = data;

    const query = `
      INSERT INTO services (
        name, icon, description, listing_date, listing_price,
        discount_amount, discount_percentage, discount_type,
        created_by_id, created_by_email, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const result = await db.query(query, [
      name,
      icon,
      description,
      listing_date,
      listing_price,
      discount_amount,
      discount_percentage,
      discount_type,
      created_by_id,
      created_by_email,
      status || "draft",
    ]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = "SELECT * FROM services";
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY added_date DESC";

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = "SELECT * FROM services WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    // Remove fields that shouldn't be manually updated or cause conflicts
    const { id: _, added_date, updated_date, ...updateData } = data;

    const keys = Object.keys(updateData);
    if (keys.length === 0) return null;

    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");
    const values = keys.map((key) => updateData[key]);

    // Add updated_date
    const query = `
      UPDATE services 
      SET ${setClause}, updated_date = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *;
    `;

    const result = await db.query(query, [id, ...values]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = "DELETE FROM services WHERE id = $1 RETURNING *;";
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
