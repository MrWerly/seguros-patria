const express = require('express');
const router = express.Router();
const { crearPoliza, listarPolizas } = require('../controllers/polizas.controller');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /polizas
router.get('/', listarPolizas);

// POST /polizas
router.post('/', crearPoliza);

module.exports = router;