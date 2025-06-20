const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const { me }  = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Perfil del usuario autenticado
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtiene el perfil propio
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get('/me', auth, me);

module.exports = router;
