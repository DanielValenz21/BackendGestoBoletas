const express = require('express');
const router  = express.Router();

const auth      = require('../middlewares/authMiddleware');
const allow     = require('../middlewares/roleMiddleware');
const { validateLogFilters } = require('../middlewares/logSchema');
const logCtrl   = require('../controllers/logController');

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Historial de acciones
 *     tags: [Logs]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *       - in: query
 *         name: boletaId
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
 *       200: { description: Paginado de logs }
 */
router.get('/', auth, allow(['admin','supervisor']), validateLogFilters, logCtrl.list);

module.exports = router;
