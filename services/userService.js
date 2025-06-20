const knex   = require('knex')(require('../knexfile').development);
const bcrypt = require('bcryptjs');

exports.create = async ({ username, password, roleId }) => {
  const exists = await knex('users').where({ username }).first();
  if (exists) throw Object.assign(new Error('Usuario ya existe'), { status: 400 });

  const password_hash = await bcrypt.hash(password, 10);
  const [id] = await knex('users').insert({ username, password_hash, role_id: roleId });
  return { id, username, roleId };
};

exports.list = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const data = await knex('users')
    .select('id', 'username', 'role_id', 'created_at')
    .orderBy('id')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await knex('users').count('id as count');
  return {
    page, limit,
    total: Number(count),
    data
  };
};

exports.update = async (id, payload) => {
  // 1. Si viene password → generar nuevo hash
  if (payload.password) {
    payload.password_hash = await bcrypt.hash(payload.password, 10);
    delete payload.password;
  }

  // 2. Mapear roleId (camelCase) a role_id (snake_case)
  if (payload.roleId !== undefined) {
    payload.role_id = payload.roleId;
    delete payload.roleId;
  }

  // 3. Ejecutar update
  await knex('users').where({ id }).update(payload);
  return { id, ...payload };
};

exports.remove = async (id) => knex('users').where({ id }).del();
