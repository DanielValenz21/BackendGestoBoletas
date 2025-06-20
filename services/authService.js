const bcrypt = require('bcryptjs');
const knex   = require('knex')(require('../knexfile').development);
const { signAccessToken, signRefreshToken, verifyToken } = require('../utils/jwt');

exports.register = async ({ username, password }) => {
  const existing = await knex('users').where({ username }).first();
  if (existing) throw Object.assign(new Error('El usuario ya existe'), { status: 400 });

  // Rol por defecto = agente
  const role = await knex('roles').where({ name: 'agente' }).first();
  const roleId = role ? role.id : 2;

  const password_hash = await bcrypt.hash(password, 10);
  const [id] = await knex('users').insert({ username, password_hash, role_id: roleId });

  return { id, username, roleId };
};

exports.login = async ({ username, password }) => {
  const user = await knex('users').where({ username }).first();
  if (!user) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });

  const payload = { sub: user.id, role: user.role_id };

  return {
    accessToken:  signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
};

exports.refresh = async (refreshToken) => {
  const payload = verifyToken(refreshToken);
  return signAccessToken({ sub: payload.sub, role: payload.role });
};
