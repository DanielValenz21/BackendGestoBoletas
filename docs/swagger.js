const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestor de Boletas – BackendboletasGestor',
      version: '1.0.0',
      description: 'Documentación automática de los endpoints'
    },
    servers: [
      { url: 'http://localhost:3000/api/v1', description: 'Dev server' }
    ]
  },
  apis: ['./routes/*.js']   // todos los archivos de rutas
};

module.exports = swaggerJSDoc(options);
