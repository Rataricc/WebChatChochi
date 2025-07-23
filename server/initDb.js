// server/initDb.js
import pool from './db.js';

export async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabla 'messages' verificada/creada correctamente");
  } catch (error) {
    console.error("❌ Error al crear/verificar tabla:", error);
  }
}
