require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('Error fatal: JWT_SECRET no está definido. Definí esta variable de entorno antes de iniciar la aplicación.');
  process.exit(1);
}

const express = require('express');
const { seedAdmin } = require('./config/seeder');
const app = express();

app.use(express.json());

app.use('/auth',     require('./routes/auth.routes'));
app.use('/clientes', require('./routes/clientes.routes'));
app.use('/polizas',  require('./routes/polizas.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await seedAdmin();
});

module.exports = app;