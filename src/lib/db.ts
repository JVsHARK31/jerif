import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'jerif.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    form_schema TEXT NOT NULL,
    program_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    verification_id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    expires_at DATETIME NOT NULL,
    used_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
  );

  CREATE TABLE IF NOT EXISTS verifications (
    id TEXT PRIMARY KEY,
    verification_id TEXT NOT NULL,
    result_status TEXT NOT NULL,
    reason_code TEXT,
    reason_message TEXT,
    form_data TEXT,
    raw_provider_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (verification_id) REFERENCES sessions(verification_id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    verification_id TEXT,
    ip TEXT,
    user_agent TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Helper functions
export function getCampaign(id: string) {
  const stmt = db.prepare('SELECT * FROM campaigns WHERE id = ?');
  const campaign = stmt.get(id) as any;
  if (campaign) {
    campaign.form_schema = JSON.parse(campaign.form_schema);
    campaign.program_info = campaign.program_info ? JSON.parse(campaign.program_info) : null;
  }
  return campaign;
}

export function createCampaign(data: {
  id: string;
  title: string;
  description?: string;
  form_schema: any;
  program_info?: any;
}) {
  const stmt = db.prepare(`
    INSERT INTO campaigns (id, title, description, form_schema, program_info)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    data.id,
    data.title,
    data.description || null,
    JSON.stringify(data.form_schema),
    data.program_info ? JSON.stringify(data.program_info) : null
  );
  return getCampaign(data.id);
}

export function getAllCampaigns() {
  const stmt = db.prepare('SELECT * FROM campaigns ORDER BY created_at DESC');
  const campaigns = stmt.all() as any[];
  return campaigns.map(c => ({
    ...c,
    form_schema: JSON.parse(c.form_schema),
    program_info: c.program_info ? JSON.parse(c.program_info) : null
  }));
}

export function getSession(verificationId: string) {
  const stmt = db.prepare(`
    SELECT s.*, c.title as campaign_title, c.description as campaign_description, 
           c.form_schema, c.program_info
    FROM sessions s
    JOIN campaigns c ON s.campaign_id = c.id
    WHERE s.verification_id = ?
  `);
  const session = stmt.get(verificationId) as any;
  if (session) {
    session.form_schema = JSON.parse(session.form_schema);
    session.program_info = session.program_info ? JSON.parse(session.program_info) : null;
  }
  return session;
}

export function createSession(data: {
  verification_id: string;
  campaign_id: string;
  expires_at: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO sessions (verification_id, campaign_id, expires_at)
    VALUES (?, ?, ?)
  `);
  stmt.run(data.verification_id, data.campaign_id, data.expires_at);
  return getSession(data.verification_id);
}

export function updateSessionStatus(verificationId: string, status: string) {
  const stmt = db.prepare(`
    UPDATE sessions SET status = ?, used_at = CURRENT_TIMESTAMP
    WHERE verification_id = ?
  `);
  stmt.run(status, verificationId);
}

export function createVerification(data: {
  id: string;
  verification_id: string;
  result_status: string;
  reason_code?: string;
  reason_message?: string;
  form_data?: any;
  raw_provider_response?: any;
}) {
  const stmt = db.prepare(`
    INSERT INTO verifications (id, verification_id, result_status, reason_code, reason_message, form_data, raw_provider_response)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    data.id,
    data.verification_id,
    data.result_status,
    data.reason_code || null,
    data.reason_message || null,
    data.form_data ? JSON.stringify(data.form_data) : null,
    data.raw_provider_response ? JSON.stringify(data.raw_provider_response) : null
  );
}

export function getVerification(verificationId: string) {
  const stmt = db.prepare('SELECT * FROM verifications WHERE verification_id = ? ORDER BY created_at DESC LIMIT 1');
  const verification = stmt.get(verificationId) as any;
  if (verification) {
    verification.form_data = verification.form_data ? JSON.parse(verification.form_data) : null;
    verification.raw_provider_response = verification.raw_provider_response ? JSON.parse(verification.raw_provider_response) : null;
  }
  return verification;
}

export function getAllVerifications(filters?: { status?: string; search?: string }) {
  let query = `
    SELECT v.*, s.campaign_id, c.title as campaign_title
    FROM verifications v
    JOIN sessions s ON v.verification_id = s.verification_id
    JOIN campaigns c ON s.campaign_id = c.id
    WHERE 1=1
  `;
  const params: any[] = [];
  
  if (filters?.status) {
    query += ' AND v.result_status = ?';
    params.push(filters.status);
  }
  
  if (filters?.search) {
    query += ' AND v.verification_id LIKE ?';
    params.push(`%${filters.search}%`);
  }
  
  query += ' ORDER BY v.created_at DESC';
  
  const stmt = db.prepare(query);
  const verifications = stmt.all(...params) as any[];
  return verifications.map(v => ({
    ...v,
    form_data: v.form_data ? JSON.parse(v.form_data) : null,
    raw_provider_response: v.raw_provider_response ? JSON.parse(v.raw_provider_response) : null
  }));
}

export function createAuditLog(data: {
  action: string;
  verification_id?: string;
  ip?: string;
  user_agent?: string;
  details?: any;
}) {
  const stmt = db.prepare(`
    INSERT INTO audit_logs (action, verification_id, ip, user_agent, details)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    data.action,
    data.verification_id || null,
    data.ip || null,
    data.user_agent || null,
    data.details ? JSON.stringify(data.details) : null
  );
}

export default db;
