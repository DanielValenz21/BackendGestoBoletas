const dashService = require('../services/dashboardService');

exports.metrics = async (_req, res, next) => {
  try {
    const kpis = await dashService.getMetrics();
    res.json(kpis);
  } catch (err) { next(err); }
};
