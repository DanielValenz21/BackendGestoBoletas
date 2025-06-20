const knex = require('knex')(require('../knexfile').development);

exports.getMetrics = async () => {
  /* 1 ▸ Conteo por estado */
  const boletasPorEstado = await knex('boletas')
    .select('estado')
    .count('id as total')
    .groupBy('estado');

  /* 2 ▸ Tiempo medio entre creación y pago (minutos) */
  const avgRow = await knex('boletas')
    .whereNotNull('fecha_pago')
    .first(
      knex.raw(`
        AVG(
          TIMESTAMPDIFF(
            MINUTE,
            created_at,
            TIMESTAMP(fecha_pago, hora_infraccion)
          )
        ) AS avgMin
      `)
    );
  const tiempoMedioRegistroMin = avgRow ? Number(avgRow.avgMin) : 0;

  /* 3 ▸ % pagadas ≤ 7 días */
  const totalRow   = await knex('boletas').first(knex.raw('COUNT(id) AS total'));
  const pagadasRow = await knex('boletas')
    .where('estado','Pagada')
    .andWhereRaw('DATEDIFF(fecha_pago, fecha_infraccion) <= 7')
    .first(knex.raw('COUNT(id) AS pagadas7'));

  const total     = Number(totalRow.total);
  const pagadas7  = Number(pagadasRow.pagadas7);
  const porcentajePagadas7dias = total ? ((pagadas7 / total) * 100).toFixed(2) : '0.00';

  return {
    boletasPorEstado,
    tiempoMedioRegistroMin,
    porcentajePagadas7dias
  };
};
