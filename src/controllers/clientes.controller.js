const pool = require('../config/db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /clientes
const crearCliente = async (req, res) => {
  const nombre    = (req.body.nombre    ?? '').toString().trim();
  const documento = (req.body.documento ?? '').toString().trim();
  const email     = (req.body.email     ?? '').toString().trim();

  if (!nombre || !documento || !email) {
    return res.status(400).json({ error: 'nombre, documento y email son requeridos' });
  }

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'El formato del email no es válido' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO clientes (nombre, documento, email)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, documento, email]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      if (err.constraint.includes('documento')) {
        return res.status(409).json({ error: 'El documento ya está registrado' });
      }
      if (err.constraint.includes('email')) {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }
    }
    console.error('Error al crear cliente:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /clientes
const listarClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al listar clientes:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /clientes/resumen
const resumenClientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         c.id,
         c.nombre,
         c.documento,
         c.email,
         COUNT(p.id)                        AS cantidad_polizas,
         COALESCE(SUM(p.monto_asegurado), 0) AS monto_total_asegurado
       FROM clientes c
       LEFT JOIN polizas p ON p.cliente_id = c.id
       GROUP BY c.id, c.nombre, c.documento, c.email
       ORDER BY monto_total_asegurado DESC`
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener resumen:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { crearCliente, listarClientes, resumenClientes };
