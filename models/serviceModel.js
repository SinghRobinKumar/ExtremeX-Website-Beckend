import db from '../config/db.js';

export default class Service {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        short_description TEXT,
        long_description TEXT,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        status VARCHAR(50) DEFAULT 'draft',
        images JSONB DEFAULT '{}',
        pricing JSONB DEFAULT '{}',
        details JSONB DEFAULT '{}',
        seo JSONB DEFAULT '{}',
        featured BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
  }

  static async create(data) {
    const {
      title, slug, short_description, long_description, category, subcategory,
      status, images, pricing, details, seo, featured
    } = data;

    const query = `
      INSERT INTO services (
        title, slug, short_description, long_description, category, subcategory,
        status, images, pricing, details, seo, featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    
    const result = await db.query(query, [
      title, slug, short_description, long_description, category, subcategory,
      status, images, pricing, details, seo, featured
    ]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM services';
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(filters.status);
    }
    
    if (filters.featured) {
        conditions.push(`featured = $${params.length + 1}`);
        params.push(filters.featured);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM services WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM services WHERE slug = $1';
    const result = await db.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, data) {
    // Remove fields that shouldn't be manually updated or cause conflicts
    const { id: _, created_at, updated_at, ...updateData } = data;
    
    const keys = Object.keys(updateData);
    if (keys.length === 0) return null;

    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = keys.map(key => updateData[key]);
    
    // Add updated_at
    const query = `
      UPDATE services 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *;
    `;
    
    const result = await db.query(query, [id, ...values]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM services WHERE id = $1 RETURNING *;';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
