/**
 * @swagger
 * /boletas:
 *   post:
 *     summary: Crea una boleta
 *     tags: [Boletas]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoletaCreate'
 *     responses:
 *       201: { description: Creada }
 */

const express = require('express');
const router  = express.Router();

const auth  = require('../middlewares/authMiddleware');
const allow = require('../middlewares/roleMiddleware'); // para pagos (cajero, admin)

const boletaCtrl = require('../controllers/boletaController');
const {
  validateCreateBoleta,
  validateListBoletas,
  validatePago
} = require('../middlewares/boletaSchema.js');

/**
 * @swagger
 * /boletas:
 *   get:
 *     summary: Lista boletas con filtros
 *     tags: [Boletas]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema: { type: string, enum: [Pendiente, Pagada, Exonerada] }
 *       - in: query
 *         name: placa
 *         schema: { type: string }
 *       - in: query
 *         name: agenteId
 *         schema: { type: integer }
 *       - in: query
 *         name: fechaDesde
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: fechaHasta
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista paginada }
 */
router.get('/',  auth, validateListBoletas, boletaCtrl.list);

/**
 * @swagger
 * /boletas/{id}:
 *   get:
 *     summary: Detalle de boleta
 *     tags: [Boletas]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Detalle completo }
 */
router.get('/:id', auth, boletaCtrl.detail);

/**
 * @swagger
 * /boletas/{id}/pago:
 *   put:
 *     summary: Registrar pago de boleta
 *     tags: [Boletas]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fechaPago, recibo]
 *             properties:
 *               fechaPago: { type: string, format: date }
 *               recibo:    { type: string }
 *     responses:
 *       200: { description: Pago registrado }
 */
router.put('/:id/pago', auth, allow(['admin', 'cajero']), validatePago, boletaCtrl.registerPago);

/**
 * @swagger
 * /boletas/{id}/pdf:
 *   get:
 *     summary: Genera PDF de la boleta o constancia
 *     tags: [Boletas]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: PDF en línea
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/pdf', auth, boletaCtrl.generatePdf);

// Crear boleta (agentes y admin)
router.post('/', auth, allow(['admin', 'agente']), validateCreateBoleta, boletaCtrl.create);

/**
 * @swagger
 * components:
 *   schemas:
 *     Articulo:
 *       type: object
 *       required: [articulo_codigo, monto]
 *       properties:
 *         articulo_codigo: { type: string, maxLength: 50, example: "152-7" }
 *         monto:           { type: number, example: 500.00 }
 *
 *     BoletaCreate:
 *       type: object
 *       required:
 *         - placa
 *         - fecha_infraccion
 *         - hora_infraccion
 *         - total_pagar
 *         - articulos
 *       properties:
 *         placa:               { type: string, maxLength: 20, example: "P123BCD" }
 *         tarjeta_circulacion: { type: string, maxLength: 20, example: "TC-98765" }
 *         nit:                 { type: string, maxLength: 20, example: "556677-1" }
 *         tipo_vehiculo:       { type: string, example: "Sedán" }
 *         marca:               { type: string, example: "Toyota" }
 *         color:               { type: string, example: "Rojo" }
 *         conductor_ausente:   { type: boolean, example: false }
 *         genero:              { type: string, enum: [M,F,O], example: "M" }
 *         documento:           { type: string, example: "DPI 1234567890101" }
 *         licencia_tipo:       { type: string, example: "B" }
 *         licencia_numero:     { type: string, example: "B-9876543" }
 *         direccion:           { type: string, example: "4a Av. 5-55, Zona 1" }
 *         lugar:               { type: string, example: "Av. Central y 1a Calle" }
 *         fecha_infraccion:    { type: string, format: date, example: "2025-06-20" }
 *         hora_infraccion:     { type: string, example: "14:35:00" }
 *         base_legal:          { type: string, example: "Art. 152 numeral 7" }
 *         observaciones:       { type: string, example: "Vehículo mal estacionado" }
 *         descuento_pct:       { type: number, example: 0 }
 *         total_pagar:         { type: number, example: 500.00 }
 *         articulos:
 *           type: array
 *           minItems: 1
 *           maxItems: 3
 *           items: { $ref: '#/components/schemas/Articulo' }
 */

module.exports = router;
