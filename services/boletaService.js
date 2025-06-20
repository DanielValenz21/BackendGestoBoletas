const knex = require('knex')(require('../knexfile').development);
const pdfGenerator = require('../utils/pdfGenerator');
const logger = require('../utils/logger');

exports.create = async (agenteId, data) => {
  return knex.transaction(async trx => {
    const {
      articulos,   // array
      ...boleta
    } = data;
    boleta.agente_id = agenteId;

    const [boletaId] = await trx('boletas').insert(boleta);

    const articulosRows = articulos.map(a => ({ ...a, boleta_id: boletaId }));
    await trx('boleta_articulos').insert(articulosRows);

    await trx('logs').insert({
      user_id: agenteId,
      boleta_id: boletaId,
      action: 'Creación de boleta'
    });

    return { id: boletaId, ...boleta, articulos };
  });
};

exports.list = async (filters) => {
  const { page, limit, ...rest } = filters;
  const offset = (page - 1) * limit;
  const q = knex('boletas').select('*');

  if (rest.estado)       q.where('estado', rest.estado);
  if (rest.placa)        q.where('placa', 'like', `%${rest.placa}%`);
  if (rest.agenteId)     q.where('agente_id', rest.agenteId);
  if (rest.fechaDesde)   q.where('fecha_infraccion', '>=', rest.fechaDesde);
  if (rest.fechaHasta)   q.where('fecha_infraccion', '<=', rest.fechaHasta);

  const data = await q.orderBy('id','desc').limit(limit).offset(offset);
  const [{ count }] = await knex('boletas').count('id as count');

  return { page, limit, total: Number(count), data };
};

exports.detail = async (id) => {
  const boleta = await knex('boletas').where({ id }).first();
  if (!boleta) throw Object.assign(new Error('Boleta no encontrada'), { status: 404 });

  boleta.articulos = await knex('boleta_articulos').where({ boleta_id: id });
  boleta.logs      = await knex('logs').where({ boleta_id: id }).orderBy('id');

  return boleta;
};

exports.registerPago = async (id, { fechaPago, recibo }, userId) => {
  return knex.transaction(async trx => {
    const affected = await trx('boletas')
      .where({ id })
      .update({ fecha_pago: fechaPago, recibo, estado: 'Pagada' });

    if (!affected) throw Object.assign(new Error('Boleta no encontrada'), { status: 404 });

    await trx('logs').insert({
      user_id: userId,
      boleta_id: id,
      action: 'Registro de pago'
    });

    return { id, fechaPago, recibo, estado: 'Pagada' };
  });
};

exports.generatePdf = async (id) => {
  const data = await exports.detail(id);  // reutiliza detail
  // Genera PDF (devuelve Buffer)
  return pdfGenerator.boletaPdf(data);
};
