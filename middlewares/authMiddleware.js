const jwt  = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile').development);
const { jwt: cfg } = require('../config/config');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const payload = jwt.verify(token, cfg.secret);
    // Opcional: obtener datos frescos de la BD
    const user = await knex('users')
      .select('id', 'username', 'role_id')
      .where({ id: payload.sub })
      .first();
    if (!user) throw new Error('Usuario no encontrado');

    req.user = user;   // ← disponible en siguientes middlewares/controladores
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
