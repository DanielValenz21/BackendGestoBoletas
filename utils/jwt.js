const jwt = require('jsonwebtoken');
const { jwt: cfg } = require('../config/config');

exports.signAccessToken = (payload) =>
  jwt.sign(payload, cfg.secret, { expiresIn: cfg.expiresIn });

exports.signRefreshToken = (payload) =>
  jwt.sign(payload, cfg.secret, { expiresIn: cfg.refreshExpiresIn });

exports.verifyToken = (token) => jwt.verify(token, cfg.secret);
