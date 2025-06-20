const knex = require('knex')(require('../knexfile').development);

exports.list = async (filters) => {
  const { page, limit, ...rest } = filters;
  const offset = (page - 1) * limit;

  const q = knex('logs')
    .select('logs.*', 'users.username')
    .leftJoin('users', 'logs.user_id', 'users.id');

  if (rest.userId)    q.where('logs.user_id', rest.userId);
  if (rest.boletaId)  q.where('logs.boleta_id', rest.boletaId);
  if (rest.fechaDesde) q.where('logs.created_at', '>=', rest.fechaDesde);
  if (rest.fechaHasta) q.where('logs.created_at', '<=', rest.fechaHasta);

  const data = await q.orderBy('logs.id','desc').limit(limit).offset(offset);
  const [{ count }] = await knex('logs').count('id as count');

  return { page, limit, total: Number(count), data };
};
