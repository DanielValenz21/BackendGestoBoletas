const express = require('express');
const router  = express.Router();      // ← DEFINE router ANTES de usarlo

const {
  register,
  login,
  refresh
} = require('../controllers/authController');

const {
  validateRegister,
  validateLogin,
  validateRefresh
} = require('../middlewares/validateSchema');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Crea una nueva cuenta
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: daniel }
 *               password: { type: string, example: 123456 }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Datos inválidos }
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Obtiene access y refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200: { description: Tokens generados }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renueva accessToken usando refreshToken
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Nuevo accessToken }
 *       401: { description: RefreshToken inválido o expirado }
 */
router.post('/refresh', validateRefresh, refresh);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBody:
 *       type: object
 *       required: [username, password]
 *       properties:
 *         username: { type: string, example: daniel }
 *         password: { type: string, example: 123456 }
 */

module.exports = router;              // ← Exporta router
