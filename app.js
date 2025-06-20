const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
require('dotenv').config();

const { port }  = require('./config/config');
const authRoutes = require('./routes/auth');
const roleRoutes  = require('./routes/roles');
const userRoutes  = require('./routes/users');
const boletaRoutes = require('./routes/boletas');

const swaggerUi  = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/boletas', boletaRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Manejo de errores
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
