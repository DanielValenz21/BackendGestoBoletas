const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const { listRoles } = require('../controllers/roleController');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Listado de roles
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Devuelve la lista de roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get('/', auth, listRoles);

module.exports = router;
