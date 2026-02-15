import db from '../config/db.js';

export default class TeamMember {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url VARCHAR(500),
        social_links JSONB DEFAULT '{}'::jsonb,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_team_order ON team_members(display_order);
    `;
    await db.query(query);
  }

  static async create(data) {
    const { name, role, bio, image_url, social_links, display_order } = data;
    
    const query = `
      INSERT INTO team_members (name, role, bio, image_url, social_links, display_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    const result = await db.query(query, [
      name,
      role,
      bio || null,
      image_url || null,
      JSON.stringify(social_links || {}),
      display_order || 0
    ]);
    
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM team_members ORDER BY display_order ASC, created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM team_members WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, role, bio, image_url, social_links, display_order } = data;
    
    const query = `
      UPDATE team_members 
      SET name = COALESCE($2, name),
          role = COALESCE($3, role),
          bio = COALESCE($4, bio),
          image_url = COALESCE($5, image_url),
          social_links = COALESCE($6, social_links),
          display_order = COALESCE($7, display_order)
      WHERE id = $1 
      RETURNING *;
    `;
    
    const result = await db.query(query, [
      id,
      name,
      role,
      bio,
      image_url,
      social_links ? JSON.stringify(social_links) : null,
      display_order
    ]);
    
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM team_members WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}
