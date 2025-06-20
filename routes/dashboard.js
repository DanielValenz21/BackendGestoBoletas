const express = require('express');
const router  = express.Router();

const auth    = require('../middlewares/authMiddleware');
const dashCtrl = require('../controllers/dashboardController');

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: KPIs y métricas
 */

/**
 * @swagger
 * /dashboard/metrics:
 *   get:
 *     summary: Retorna indicadores clave (KPIs)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPIs calculados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boletasPorEstado:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       estado: { type: string, example: Pendiente }
 *                       total:  { type: integer, example: 12 }
 *                 tiempoMedioRegistroMin:
 *                   type: number
 *                   example: 143
 *                 porcentajePagadas7dias:
 *                   type: string
 *                   example: "47.62"
 */
router.get('/metrics', auth, dashCtrl.metrics);

module.exports = router;
