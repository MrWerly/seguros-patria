const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seedAdmin() {
  try {
    const exists = await pool.query(
      'SELECT id FROM users WHERE username = $1', ['admin']
    );

    if (exists.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        ['admin', hash]
      );
      console.log('Usuario admin creado (admin / admin123)');
    } else {
      console.log('Usuario admin ya existe');
    }
  } catch (err) {
    console.error('Error en seeder:', err.message);
  }
}

module.exports = { seedAdmin };