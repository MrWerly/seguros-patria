const bcrypt = require('bcryptjs');
const pool = require('./db');

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error(
      'Seeder: ADMIN_USERNAME y ADMIN_PASSWORD deben estar definidos en las variables de entorno. ' +
      'No se creará el usuario administrador.'
    );
    return;
  }

  try {
    const exists = await pool.query(
      'SELECT id FROM users WHERE username = $1', [username]
    );

    if (exists.rows.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, hash]
      );
      console.log(`Usuario administrador "${username}" creado exitosamente.`);
    } else {
      console.log(`Usuario administrador "${username}" ya existe.`);
    }
  } catch (err) {
    console.error('Error en seeder:', err.message);
  }
}

module.exports = { seedAdmin };
