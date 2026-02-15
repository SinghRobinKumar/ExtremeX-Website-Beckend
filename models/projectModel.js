import db from '../config/db.js';

export default class Project {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        live_url VARCHAR(500),
        technologies JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'published',
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;
      CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(display_order);
    `;
    await db.query(query);
  }

  static async create(data) {
    const { title, description, image_url, live_url, technologies, featured, status, display_order } = data;
    
    const query = `
      INSERT INTO projects (title, description, image_url, live_url, technologies, featured, status, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const result = await db.query(query, [
      title,
      description || null,
      image_url || null,
      live_url || null,
      JSON.stringify(technologies || []),
      featured || false,
      status || 'published',
      display_order || 0
    ]);
    
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async findPublished() {
    const query = `
      SELECT * FROM projects 
      WHERE status = 'published' 
      ORDER BY featured DESC, display_order ASC, created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { title, description, image_url, live_url, technologies, featured, status, display_order } = data;
    
    const query = `
      UPDATE projects 
      SET title = COALESCE($2, title),
          description = COALESCE($3, description),
          image_url = COALESCE($4, image_url),
          live_url = COALESCE($5, live_url),
          technologies = COALESCE($6, technologies),
          featured = COALESCE($7, featured),
          status = COALESCE($8, status),
          display_order = COALESCE($9, display_order)
      WHERE id = $1 
      RETURNING *;
    `;
    
    const result = await db.query(query, [
      id,
      title,
      description,
      image_url,
      live_url,
      technologies ? JSON.stringify(technologies) : null,
      featured,
      status,
      display_order
    ]);
    
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
