const pool = require('../config/db');

// POST /polizas
const crearPoliza = async (req, res) => {
  const { numero_poliza, cliente_id, fecha_emision, monto_asegurado } = req.body;

  if (!numero_poliza || !cliente_id || !fecha_emision || monto_asegurado === undefined) {
    return res.status(400).json({
      error: 'numero_poliza, cliente_id, fecha_emision y monto_asegurado son requeridos',
    });
  }

  const numPoliza = (typeof numero_poliza === 'string' ? numero_poliza : String(numero_poliza)).trim();
  if (!numPoliza) {
    return res.status(400).json({ error: 'numero_poliza no puede estar vacío' });
  }

  const clienteIdNum = Number(cliente_id);
  if (!Number.isInteger(clienteIdNum) || clienteIdNum <= 0) {
    return res.status(400).json({ error: 'cliente_id debe ser un número entero positivo' });
  }

  const fechaStr = (typeof fecha_emision === 'string' ? fecha_emision : String(fecha_emision)).trim();
  const fechaMs = Date.parse(fechaStr);
  if (isNaN(fechaMs)) {
    return res.status(400).json({ error: 'fecha_emision no es una fecha válida (use YYYY-MM-DD)' });
  }

  const monto = Number(monto_asegurado);
  if (!isFinite(monto) || monto <= 0) {
    return res.status(400).json({ error: 'monto_asegurado debe ser un número mayor a cero' });
  }

  try {
    const clienteResult = await pool.query(
      'SELECT id FROM clientes WHERE id = $1', [clienteIdNum]
    );

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ error: 'El cliente no existe' });
    }

    const result = await pool.query(
      `INSERT INTO polizas (numero_poliza, cliente_id, fecha_emision, monto_asegurado)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [numPoliza, clienteIdNum, fechaStr, monto]
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
