import db from "../config/db.js";

export default class ServiceRequest {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS service_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        service_name VARCHAR(255) NOT NULL,
        service_icon VARCHAR(255),
        
        -- Company Info
        company_name VARCHAR(255),
        company_origin VARCHAR(255),
        company_address TEXT,
        company_scale VARCHAR(50),
        has_decision_rights VARCHAR(10),
        user_role VARCHAR(100),
        company_web_address VARCHAR(255),
        company_contact_email VARCHAR(255),
        company_contact_number VARCHAR(50),
        agreed_to_terms BOOLEAN DEFAULT FALSE,

        -- Service Info
        service_type VARCHAR(50),
        service_plan VARCHAR(100),

        -- Project Info
        project_name VARCHAR(255),
        project_type VARCHAR(100),

        status VARCHAR(50) DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
  }

  static async createRequest(data) {
    const {
      userId,
      serviceName,
      serviceIcon,
      companyName,
      companyOrigin,
      companyAddress,
      companyScale,
      hasDecisionRights,
      userRole,
      companyWebAddress,
      companyContactEmail,
      companyContactNumber,
      agreedToTerms,
      serviceType,
      servicePlan,
      projectName,
      projectType,
    } = data;

    const query = `
      INSERT INTO service_requests (
        user_id, service_name, service_icon, company_name, company_origin, company_address,
        company_scale, has_decision_rights, user_role, company_web_address,
        company_contact_email, company_contact_number, agreed_to_terms,
        service_type, service_plan, project_name, project_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *;
    `;
    const result = await db.query(query, [
      userId,
      serviceName,
      serviceIcon,
      companyName,
      companyOrigin,
      companyAddress,
      companyScale,
      hasDecisionRights,
      userRole,
      companyWebAddress,
      companyContactEmail,
      companyContactNumber,
      agreedToTerms,
      serviceType,
      servicePlan,
      projectName,
      projectType,
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query =
      "SELECT * FROM service_requests WHERE user_id = $1 ORDER BY created_at DESC";
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
