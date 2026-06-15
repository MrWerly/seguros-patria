const pool = require('../config/db');

// POST /polizas
const crearPoliza = async (req, res) => {
  const { numero_poliza, cliente_id, fecha_emision, monto_asegurado } = req.body;

  if (!numero_poliza || !cliente_id || !fecha_emision || monto_asegurado === undefined) {
    return res.status(400).json({
      error: 'numero_poliza, cliente_id, fecha_emision y monto_asegurado son requeridos',
    });
  }

  if (Number(monto_asegurado) <= 0) {
    return res.status(400).json({ error: 'El monto asegurado debe ser mayor a cero' });
  }

  try {
    const clienteResult = await pool.query(
      'SELECT id FROM clientes WHERE id = $1',
      [cliente_id]
    );

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ error: 'El cliente no existe' });
    }

    const result = await pool.query(
      `INSERT INTO polizas (numero_poliza, cliente_id, fecha_emision, monto_asegurado)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [numero_poliza, cliente_id, fecha_emision, monto_asegurado]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El número de póliza ya existe' });
    }
    console.error('Error al crear póliza:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /polizas
const listarPolizas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         p.*,
         c.nombre    AS cliente_nombre,
         c.documento AS cliente_documento,
         c.email     AS cliente_email
       FROM polizas p
       JOIN clientes c ON c.id = p.cliente_id
       ORDER BY p.id ASC`
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al listar pólizas:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { crearPoliza, listarPolizas };    