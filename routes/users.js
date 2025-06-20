/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear usuario (solo admin)
 *     tags: [Users]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, roleId]
 *             properties:
 *               username: { type: string, example: maria }
 *               password: { type: string, example: 123456 }
 *               roleId:   { type: integer, example: 3 }
 *     responses:
 *       201: { description: Usuario creado }
 *
 *   get:
 *     summary: Listar usuarios (paginado, solo admin)
 *     tags: [Users]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista paginada }
 *
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario (solo admin)
 *     tags: [Users]
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
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               roleId:   { type: integer }
 *     responses:
 *       200: { description: Usuario actualizado }
 *
 *   delete:
 *     summary: Borrar usuario (solo admin)
 *     tags: [Users]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Eliminado }
 */

const express = require('express');
const router  = express.Router();

const auth  = require('../middlewares/authMiddleware');
const allow = require('../middlewares/roleMiddleware');

const userCtrl = require('../controllers/userController');
const {
  validateCreateUser,
  validateUpdateUser,
  validatePagination
} = require('../middlewares/userSchema');

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
router.get('/me', auth, userCtrl.me);

/* ---------- CRUD solo admin ---------- */
router.post('/',   auth, allow(['admin']), validateCreateUser, userCtrl.create);
router.get('/',    auth, allow(['admin']), validatePagination, userCtrl.list);
router.put('/:id', auth, allow(['admin']), validateUpdateUser, userCtrl.update);
router.delete('/:id', auth, allow(['admin']), userCtrl.remove);

module.exports = router;
