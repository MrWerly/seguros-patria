const express = require('express');
const router = express.Router();
const { crearCliente, listarClientes, resumenClientes } = require('../controllers/clientes.controller');
const authMiddleware = require('../middleware/auth');

// Todas las rutas protegidas con JWT
router.use(authMiddleware);


router.get('/resumen', resumenClientes);


router.get('/', listarClientes);


router.post('/', crearCliente);

module.exports = router;